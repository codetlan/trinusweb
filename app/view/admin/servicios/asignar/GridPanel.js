Ext.define('App.view.admin.servicios.asignar.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelAsignar',
    requires:['App.view.admin.taxistas.GridPanel'],

    initComponent:function(){
        Ext.define('Servicio', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();

        this.callParent(arguments);
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre Cliente', flex:1, sortable:true, dataIndex:'nombreCliente'},
            {text:'Nombre Taxista', flex:1, sortable:true, dataIndex:'nombreTaxista', hidden: this.esSitio},
            {text:'Dirección', flex:1, sortable:true, dataIndex:'direccion'},
            {text:'Unidad', flex:1, sortable:true, dataIndex:'unidad', hidden: this.esSitio},
            {text:'Placas', flex:1, sortable:true, dataIndex:'placas', hidden: this.esSitio},
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
                        text: 'Asignar Taxi',
                        ui: 'success',
                        iconCls: 'icon-add icon-white',//icon-ok
                        handler: me.asignarTaxi.bind(me)
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

    asignarTaxi:function(){
        var me = this,
            recordSeleccionado = this.getSelectionModel().getSelection();
        if(recordSeleccionado[0]){
            var windowBuscarTaxista = Ext.create('Ext.window.Window',{
                title:'Buscar Taxista',
                id:'windowBuscarTaxista'+this.id,
                modal:true,
                width:600,
                height:450,
                layout:'fit',
                items:[{
                    xtype:'gridpanelfilterT',
                    resumida: true,
                    esSitio: me.esSitio,
                    ocultar: true,
                    bbar:[{
                        xtype:'textfield',
                        itemId:'tEstimado',
                        fieldLabel:'Tiempo estimado de llegada',
                        labelWidth:200,
                        flex:1
                    }]
                }],
                buttons:[{
                    text:'Aceptar',
                    handler:this.onSeleccionarTaxi.bind(me)
                },{
                    text:'Cancelar',
                    scope: this,
                    handler: function(){
                        windowBuscarTaxista.close();
                    }
                }]
            }),
            gridTaxistas = windowBuscarTaxista.down('gridpanelfilterT'),
            storeTaxistas = gridTaxistas.getStore();

            storeTaxistas.filter("estatusServicio", "LIBRE");//Mostramos solo los taxistas libres

            windowBuscarTaxista.show();
        } else {
            Ext.MessageBox.alert('Información', 'Debes seleccionar un Servicio.');
        }
    },

    onSeleccionarTaxi:function(button){
        var me = this,
            window = Ext.getCmp('windowBuscarTaxista'+me.id),
            gridTaxistas = window.down('gridpanelfilterT'),
            servicioSeleccionado = me.getSelectionModel().getSelection(),
            taxistaSeleccionado = gridTaxistas.getSelectionModel().getSelection();

        if(taxistaSeleccionado[0]){
            var params = '?token=' + localStorage.getItem('Logeado') + '&idServicio=' + servicioSeleccionado[0].data.idServicio +
                '&idTaxista=' + taxistaSeleccionado[0].data.idTaxista + '&tiempoEstimado=' + gridTaxistas.down('#tEstimado').getValue();

            var invocation=new XMLHttpRequest(),
                url = 'http://isystems.com.mx:8181/Trinus/ServletOperadoraSitio'+params;
            if(invocation) {
                invocation.open('POST', url, true);
                invocation.onreadystatechange = function(response){
                    if (response.target.readyState == 4 && response.target.status == 200) {
                        var r = Ext.decode(response.target.responseText);
                        console.log('respuesta ServletOperadoraSitio' + r);
                        if (r.result == 'ok') {
                            me.getStore().remove(servicioSeleccionado[0]);
                            window.close();
                            Ext.MessageBox.alert('Información', '!Enhorabuena el servicio ha sido asignado¡');
                        }
                    }
                };
                invocation.send();
            }
        } else {
            Ext.MessageBox.alert('Información', 'Selecciona un taxista para continuar.');
        }
    }


});
