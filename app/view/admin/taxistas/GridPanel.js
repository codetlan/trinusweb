Ext.define('App.view.admin.taxistas.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelfilterT',

    esSitio:undefined,

    initComponent:function () {
        Ext.define('Taxi', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.plugins = this.buildPlugins();
        this.dockedItems = this.buildDockedItems();
        this.bbar = this.buildBbar();

        this.callParent(arguments);

        this.getSelectionModel().on('selectionchange', function (selModel, selections) {
            this.down('#delete').setDisabled(selections.length === 0);
        }, this);
    },

    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input
    afterRender:function () {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        //me.statusBar = me.down('statusbar[name=searchStatusBar]');
    },

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
        var params = '?token=' + localStorage.getItem('Logeado');

        if(this.esSitio){
            params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
        }

        var store = new Ext.data.Store({
            model:'Taxi',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletTaxistas'+params,
                reader:{
                    type:'json',
                    root:'data'
                },
                writer:{
                    type:'json'
                }
            }),
            //autoSync: true,
            autoLoad:true,
            listeners:{
                scope:this,
                update:function (store, record, operation, eOpts) {
                    var _this = this, record = record.data,
                        invocation = new XMLHttpRequest(), url,
                        params = '?nombre=' + record.nombreCompleto + '&contrasena=' + record.contrasena + '&direccion=' + record.direccion +
                            '&telCasa=' + record.movil + '&movil=' + record.movil + '&email=' + record.email + '&' +
                            'fechaNac=2013/02/11&imei=' + record.imei + '&unidad=' + record.unidad + '&placas=' + record.placas;

                    if(this.esSitio){
                        params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                    }

                    if (record.idTaxista == '') {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Create' + params + '&token=' + localStorage.getItem('Logeado');
                        if (invocation) {
                            invocation.open('POST', url, true);
                            invocation.onreadystatechange = function (response) {
                                if (response.target.readyState == 4 && response.target.status == 200) {
                                    var r = Ext.decode(response.target.responseText);
                                    if (r.result === "ok") {
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                        //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                    } else {
                                        Ext.MessageBox.alert('Información', r.result);
                                    }
                                }
                            }
                            invocation.send();
                        }
                    } else {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Update' + params + '&idTaxista=' +
                            record.idTaxista + '&token=' + localStorage.getItem('Logeado');
                        if (invocation) {
                            invocation.open('POST', url, true);
                            invocation.onreadystatechange = function (response) {
                                if (response.target.readyState == 4 && response.target.status == 200) {
                                    var r = Ext.decode(response.target.responseText);
                                    if (r.result === "ok") {
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                        //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                    } else {
                                        Ext.MessageBox.alert('Información', r.result);
                                    }
                                }
                            }
                            invocation.send();
                        }
                    }
                }
            }
        });

        return store;
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre', flex:1, sortable:true, dataIndex:'nombreCompleto', editor:{vtype:'nombre', allowBlank:false}},
            {text:'Dirección', flex:1, sortable:true, dataIndex:'direccion', editor:{vtype:'nombre', allowBlank:false}},
            {text:'Movil', flex:1, sortable:true, dataIndex:'movil', editor:{vtype:'num', allowBlank:false}},
            {text:'Email', flex:1, sortable:true, dataIndex:'email', editor:{vtype:'email', allowBlank:false}},
            {text:'Imei', flex:1, sortable:true, dataIndex:'imei', editor:{vtype:'num', allowBlank:false}},
            {text:'Unidad', flex:1, sortable:true, dataIndex:'unidad', editor:{vtype:'alphanum', allowBlank:false}},
            {text:'Placas', flex:1, sortable:true, dataIndex:'placas', editor:{vtype:'alphanum', allowBlank:false}},
            {text:'Contraseña', flex:1, sortable:true, dataIndex:'contrasena', editor:{vtype:'alphanum', allowBlank:false}},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus'}
        ];

        return cols;
    },

    buildPlugins:function () {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
        return [rowEditing];

    },

    buildDockedItems:function () {
        var me = this;
        return [
            {
                xtype:'toolbar',
                dock:'top',
                items:[
                    {
                        text:'Agregar',
                        ui:'success',
                        iconCls:'icon-plus icon-white',
                        handler:function () {
                            // empty record
                            me.store.insert(0, new Taxi());
                            me.plugins[0].startEdit(0, 0);
                        }
                    },
                    '-',
                    {
                        itemId:'delete',
                        text:'Desactivar',
                        ui:'danger',
                        iconCls:'icon-remove icon-white',
                        disabled:true,
                        handler:function () {
                            var selection = me.getView().getSelectionModel().getSelection()[0];
                            if (selection) {
                                var record = selection.data,
                                    invocation = new XMLHttpRequest(),
                                    params = '?idTaxista=' + record.idTaxista + '&token=' + localStorage.getItem('Logeado');

                                if(this.esSitio){
                                    params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                                }

                                me.fireEvent("mask");
                                if (record.idTaxista != '') {
                                    if (invocation) {
                                        invocation.open('POST', 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Delete'+params, true);
                                        invocation.onreadystatechange = function (response) {
                                            if (response.target.readyState == 4 && response.target.status == 200) {
                                                var r = Ext.decode(response.target.responseText);
                                                if (r.result === "ok") {
                                                    me.store.load();
                                                    me.fireEvent("unmask");
                                                    //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                                } else {
                                                    Ext.MessageBox.alert('Información', r.result);
                                                }
                                            }
                                        }
                                        invocation.send();
                                    }
                                }
                                me.store.remove(selection);
                                me.store.load();
                                me.fireEvent("unmask");
                            }
                        }
                    },
                    '-',
                    {
                        text: 'Actualizar',
                        ui: 'inverse',
                        iconCls: 'icon-refresh icon-white',
                        handler: function(){
                            me.fireEvent("mask");
                            me.store.load();
                            me.fireEvent("unmask");
                        }
                    }
                ]
            }
        ];
    },

    buildBbar:function () {
        var me = this, bBar, nombreC, direccion, movil, email, imei, unidad, placas, bReset;

        nombreC = me.buildTextField('nombreCompleto', 'nombre');
        direccion = me.buildTextField('direccion', 'nombre');
        movil = me.buildTextField('movil', 'num');
        email = me.buildTextField('email', 'email');
        imei = me.buildTextField('imei', 'num');
        unidad = me.buildTextField('unidad', 'alphanum');
        placas = me.buildTextField('placas', 'alphanum');
        bReset = Ext.create('Ext.Button', {text:'Limpiar', ui:'info', flex:1, iconCls:'icon-refresh icon-white', scope:this, handler:me.resetSearchs});

        bBar = [nombreC, direccion, movil, email, imei, unidad, placas, bReset];

        return bBar;
    },

    buildTextField:function (dataIndex, vtype) {
        var me = this,
            textField = {
                xtype:'textfield',
                id:dataIndex + me.id,
                flex:1,
                vtype:vtype,
                emptyText:dataIndex,
                listeners:{
                    scope:this,
                    change:me.filterStore
                }
            };

        return textField;
    },

    filterStore:function () {
        var me = this, i, value, textfields = ['nombreCompleto', 'direccion', 'movil', 'email', 'imei', 'unidad', 'placas'];
        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            value = Ext.getCmp(textfields[i] + me.id).getValue();
            if (!Ext.isEmpty(value)) {
                me.store.filter(textfields[i], value, true, false)
            }

        }

    },

    buildFields:function () { // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name:'idTaxista', type:'string'},
            {name:'nombreCompleto', type:'string'},
            {name:'direccion', type:'string'},
            {name:'movil', type:'string'},
            {name:'email', type:'string'},
            {name:'imei', type:'string'},
            {name:'unidad', type:'string'},
            {name:'placas', type:'string'},
            {name:'contrasena', type:'string'},
            {name:'estatus', type:'string'}
        ];

        return fields;
    },


    resetSearchs:function () {
        var me = this, i, textfields = ['nombreCompleto', 'direccion', 'movil', 'email', 'imei', 'unidad', 'placas'];

        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            Ext.getCmp(textfields[i] + me.id).reset();
        }
    }


});
