Ext.define('App.view.admin.historial.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelfilterH',

    esSitio:undefined,

    initComponent:function () {
        var me = this;

        Ext.define('Historial', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();
        this.bbar = this.buildBbar();

        this.store.on('load', function (t, r, o) {
            console.info(r);
        });

        this.callParent(arguments);
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre Cliente', flex:1, sortable:true, dataIndex:'nombreCliente'},
            {text:'Nombre Taxista', flex:1, sortable:true, dataIndex:'nombreTaxista'},
            {text:'Dirección', flex:1, sortable:true, dataIndex:'direccion'},
            {text:'Unidad', flex:1, sortable:true, dataIndex:'unidad'},
            {text:'Placas', flex:1, sortable:true, dataIndex:'placas'},
            {text:'Fecha', flex:1, sortable:true, dataIndex:'fechaHora'},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus'},
            {text:'Observaciones', flex:1, sortable:true, dataIndex:'observaciones'}
        ];

        return cols;
    },

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
        var params = '?token=' + localStorage.getItem('Logeado');

        if(this.esSitio){
            params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
        }

        var store = new Ext.data.Store({
            model:'Historial',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletServicios' + params,
                reader:{
                    type:'json',
                    root:'data'
                }
            }),
            autoLoad:true
        });

        return store;
    },

    buildFields:function () { // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name:'nombreCliente', type:'string'},
            {name:'nombreTaxista', type:'string'},
            {name:'direccion', type:'string'},
            {name:'unidad', type:'string'},
            {name:'placas', type:'string'},
            {name:'fechaHora', type:'string'},
            {name:'estatus', type:'string'},
            {name:'observaciones', type:'string'}
        ];

        return fields;
    },

    buildDockedItems:function () {
        var me = this;
        return [
            {
                xtype:'toolbar',
                dock:'top',
                items:[
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

        nombreC = me.buildTextField('nombreTaxista', 'nombre');
        direccion = me.buildTextField('nombreCliente', 'nombre');
        movil = me.buildDateField('fechaHora');
        email = me.buildCombo('estatus', 'estatus');
        bReset = Ext.create('Ext.Button', {text:'Limpiar', ui:'info', flex:1, iconCls:'icon-refresh icon-white', scope:this, handler:me.resetSearchs});

        bBar = [nombreC, direccion, movil, email, bReset];

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
        var me = this, i, value, textfields = ['nombreTaxista', 'nombreCliente', 'fechaHora', 'estatus'];
        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            value = Ext.getCmp(textfields[i] + me.id).getValue();
            if (!Ext.isEmpty(value)) {
                me.store.filter(textfields[i], value, true, false)
            }

        }

    },

    buildDateField: function (dataIndex, vtype){
        var me = this,
            dateField = {
                xtype: 'datefield',
                id: dataIndex + me.id,
                flex:1,
                emptyText: dataIndex,
                listeners: {
                    scope: this,
                    change:me.filterStore
                }
            };
        return dateField;
    },

    buildCombo:function (name, dataIndex) {
        var me = this, combo;

        combo = Ext.create('Ext.form.ComboBox', {
            id:dataIndex + this.id,
            store:me.buildStore().collect(dataIndex),
            emptyText:name,
            displayField:dataIndex,
            valueField:dataIndex,
            queryMode:'local',
            flex:1,
            listeners:{
                scope:this,
                change:function (t, nv, ov, eOpts) {
                    me.filterStore();
                }
            }
        });

        return combo;
    },

    resetSearchs:function () {
        var me = this, i, textfields = ['nombreTaxista', 'nombreCliente', 'fechaHora', 'estatus'];

        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            Ext.getCmp(textfields[i] + me.id).reset();
        }
    }


});
