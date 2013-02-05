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

    bodyPadding:15,

    defaults:{
        labelWidth:140,
        style: {
            fontFamily: 'orbitron-medium'
        },
        padding: '20'
    },


    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                xtype:'textfield',
                //fieldLabel:'Ubicaci&oacute;n',
                name:'txtOrigen',
                width:370,
                emptyText: 'Ubicación'
            },{
                xtype:'textfield',
                //fieldLabel:'Destino',
                id:'txtDestino',
                width:370,
                name:'txtDestino',
                emptyText:'Destino *No Obligatorio'
            },
            {
                xtype:'textarea',
                //fieldLabel:'Observaciones',
                width:370,
                name:'txtObservaciones',
                emptyText:'Observaciones *No Obligatorio'
            },
            {
                xtype: 'container'
            },
            {
                xtype:'button',
                text:'<font size="12pt";>Pedir Taxi</font>',
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


