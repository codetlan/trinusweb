Ext.define('App.view.admin.servicios.asignar.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelAsignar',

    initComponent:function(){
        Ext.define('Servicio', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();
        this.plugins = this.buildPlugins();

        this.callParent(arguments);
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre Cliente', flex:1, sortable:true, dataIndex:'nombreCliente'},
            {text:'Nombre Taxista', flex:1, sortable:true, dataIndex:'nombreTaxista'},
            {text:'Dirección', flex:1, sortable:true, dataIndex:'direccion'},
            {text:'Unidad', flex:1, sortable:true, dataIndex:'unidad'},
            {text:'Placas', flex:1, sortable:true, editor:{vtype:'alphanum', allowBlank:false}, dataIndex:'placas'},
            {text:'Fecha', flex:1, sortable:true, dataIndex:'fechaHora'},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus'},
            {text:'Observaciones', flex:1, sortable:true, dataIndex:'observaciones'}
        ];

        return cols;
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
    buildFields:function () { // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name:'idServicio', type:'int'},
            {name:'idTaxista', type:'int'},
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

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero

        var store = new Ext.data.Store({
            model:'Servicio',
            storeId: 'storeAsignar',
            data:[]
        });

        return store;
    },

    buildDockedItems:Ext.emptyFn,

    buildPlugins:function () {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
        return [rowEditing];

    }


});
