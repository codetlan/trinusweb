Ext.define('App.view.admin.clientes.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelfilterC',

    initComponent:function () {
        Ext.define('Cliente', {
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
        this.aplicarVtypes();
    },

    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input
    afterRender:function () {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        //me.statusBar = me.down('statusbar[name=searchStatusBar]');
    },

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
        var store = new Ext.data.Store({
            model:'Cliente',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletClientes?token=' + localStorage.getItem('Logeado'),
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
                        params = 'nombre_completo=' + record.nombreCompleto + '&contrasena=' + record.contrasena +
                            '&movil=' + record.movil + '&email=' + record.email;

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
            {text:'Contraseña', flex:1, sortable:true, dataIndex:'contrasena', editor:{vtype:'alphanum', allowBlank:false}}
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
                        text:'<span style="color:#FFF;">Agregar</span>',
                        ui:'success',
                        handler:function () {
                            // empty record
                            me.store.insert(0, new Cliente());
                            me.plugins[0].startEdit(0, 0);
                        }
                    },
                    '-',
                    {
                        itemId:'delete',
                        text:'<span style="color:#FFF;">Eliminar</span>',
                        ui:'danger',
                        disabled:true,
                        handler:function () {
                            var selection = me.getView().getSelectionModel().getSelection()[0];
                            if (selection) {
                                console.info(selection);
                                var record = selection.data,
                                    invocation = new XMLHttpRequest(),
                                    url = 'http://isystems.com.mx:8181/Trinus/ServletCliente/Delete?idCliente=' + record.idCliente + '&token=' + localStorage.getItem('Logeado');
                                me.fireEvent("mask");
                                if (invocation) {
                                    invocation.open('POST', url, true);
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
                                me.store.remove(selection);
                            }
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
            {name:'contrasena', type:'string'}
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

    aplicarVtypes:function () {
        Ext.apply(Ext.form.field.VTypes, {
            //  vtype validation function
            nombreMask:/^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/,
            nombreText:'Nombre no v&aacute;lido',
            nombre:function (val, field) {
                var regExp = /^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/;
                ///^[a-zA-Z ][-_.a-zA-Z0-9 ]{0,30}$/;
                return regExp.test(val);
            },
            numMask:/[\d\$.]/,
            num:function (val, field) {
                return val;
            }
        });
    }


});

