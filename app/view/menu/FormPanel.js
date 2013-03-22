/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.menu.FormPanel', {
    extend:'Ext.form.FormPanel',
    alias:'widget.formpanel',

    bodyPadding: 10,

    defaults:{
        labelAlign: 'top',
        paddingTop: 30,
        style: {
            fontFamily: 'orbitron-medium'
        }
    },


    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                xtype:'textfield',
                fieldLabel:'Ubicaci&oacute;n',
                name:'txtOrigen',
                emptyText: 'Ubicación'
            },{
                xtype:'textfield',
                fieldLabel:'Destino',
                id:'txtDestino',
                name:'txtDestino',
                emptyText:'No Obligatorio'
            },
            {
                xtype:'textarea',
                fieldLabel:'Observaciones',
                name:'txtObservaciones',
                emptyText:'No Obligatorio'
            },
            {
                xtype:'button',
                text:'Pedir Taxi',
                //icon: 'images/trinus.png',
                flex: 2,
                scope:this,
                ui:'warning',
                scale:'large',
                handler:function(){
                    this.fireEvent('pedirtaxi', this.form.getValues());
                }
            }
        ];

        return items;
    },

    setAddressText:function (address) {
        this.items.items[1].items.items[0].setValue(address);
    }
});


