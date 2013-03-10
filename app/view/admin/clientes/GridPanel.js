Ext.define('App.view.admin.clientes.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelfilterC',

    esSitio:undefined,

    viewConfig:{
        forceFit:true,
        showPreview:true, // custom property
        enableRowBody:true,
        getRowClass:function (r, i, rp, d) {
            if (r.data.estatus == 'INACTIVO') {
                rp.body = '<p>' + r.data.estatus + 'didier</p>'
                return 'redUnder';
            }
        }
    },

    initComponent:function () {
        Ext.define('Cliente', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.plugins = this.buildPlugins();
        this.dockedItems = this.buildDockedItems();
        //this.bbar = this.buildBbar();

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
        if (this.esSitio) {
            params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitito;
        }
        var store = new Ext.data.Store({
            model:'Cliente',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletClientes' + params,
                reader:{
                    type:'json',
                    root:'data'
                },
                writer:{
                    type:'json'
                }
            }),
            autoLoad:true,
            listeners:{
                scope:this,
                update:function (store, record, operation, eOpts) {
                    var _this = this, record = record.data,
                        invocation = new XMLHttpRequest(), url,
                        params = 'nombre=' + record.nombreCompleto + '&contrasena=' + record.contrasena +
                            '&movil=' + record.movil + '&email=' + record.email;

                    if (this.esSitio) {
                        params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                    }

                    if (record.idCliente == '') {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletCliente/Create?' + params + '&token=' + localStorage.getItem('Logeado');
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
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                    }
                                }
                            }
                            invocation.send();
                        }
                    } else {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletCliente/Update?' + params + '&idCliente=' +
                            record.idCliente + '&token=' + localStorage.getItem('Logeado');
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
            {text:'Movil', flex:1, sortable:true, dataIndex:'movil', editor:{vtype:'num', allowBlank:false}},
            {text:'Email', flex:1, sortable:true, dataIndex:'email', editor:{vtype:'email', allowBlank:false}},
            {text:'Contraseña', flex:1, sortable:true, dataIndex:'contrasena', editor:{vtype:'alphanum', allowBlank:false}},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus' }
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
                        //iconCls: 'icon-plus icon-white',
                        handler:function () {
                            // empty record
                            me.store.insert(0, new Cliente());
                            me.plugins[0].startEdit(0, 0);
                        }
                    },
                    '-',
                    {
                        itemId:'delete',
                        text:'Desactivar',
                        ui:'danger',
                        //iconCls: 'icon-remove icon-white',
                        disabled:true,
                        handler:function () {
                            var selection = me.getView().getSelectionModel().getSelection()[0];
                            if (selection) {
                                var record = selection.data,
                                    invocation = new XMLHttpRequest(),
                                    params = '?idCliente=' + record.idCliente + '&token=' + localStorage.getItem('Logeado');

                                if (this.esSitio) {
                                    params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                                }

                                me.fireEvent("mask");
                                if (record.idCliente != '') {
                                    if (invocation) {
                                        invocation.open('POST', 'http://isystems.com.mx:8181/Trinus/ServletCliente/Delete' + params, true);
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
                        text:'Actualizar',
                        ui:'inverse',
                        iconCls:'icon-refresh icon-white',
                        handler:function () {
                            me.fireEvent("mask");
                            me.store.load();
                            me.fireEvent("unmask");
                        }
                    },
                    '->',
                    {
                        xtype:'textfield',
                        fieldLabel:'Buscar',
                        listeners:{
                            scope:this,
                            change:this.spotLight
                        }
                    }
                ]
            }
        ];
    },

    buildBbar:function () {
        var me = this, bBar, nombreC, movil, email, bReset;

        nombreC = me.buildTextField('nombreCompleto', 'nombre');
        movil = me.buildTextField('movil', 'num');
        email = me.buildTextField('email', 'email');
        bReset = Ext.create('Ext.Button', {text:'Limpiar', ui:'info', flex:1, scope:this, handler:me.resetSearchs});

        bBar = [nombreC, movil, email, bReset];

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
        var me = this, i, value, textfields = ['nombreCompleto', 'movil', 'email'];
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
            {name:'idCliente', type:'string'},
            {name:'nombreCompleto', type:'string'},
            {name:'movil', type:'string'},
            {name:'email', type:'string'},
            {name:'contrasena', type:'string'},
            {name:'estatus', type:'string'}
        ];

        return fields;
    },

    resetSearchs:function () {
        var me = this, i, textfields = ['nombreCompleto', 'movil', 'email'];

        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            Ext.getCmp(textfields[i] + me.id).reset();
        }
    },

    spotLight:function (t, newValue, oldValue, e) {
        var me = this;

        me.store.clearFilter(true);

        me.store.filterBy(function(record){
            if(record.get('nombreCompleto').search(newValue)  != -1 || record.get('movil').search(newValue) != -1
                || record.get('email').search(newValue) != -1 || record.get('contrasena').search(newValue) != -1
                || record.get('estatus').search(newValue) != -1){
                return true;
            }
        },this);
    }
});

