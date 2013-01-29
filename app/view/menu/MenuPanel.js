/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.menu.MenuPanel', {
    extend: 'Ext.container.Container',
    alias :'widget.menupanel',
    requires: ['Ext.XTemplate'],


    initComponent:function(){
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function(){
        var items = [
            {
                xtype: 'form',
                title: 'Pide Tu taxi',
                flex: 1,
                bodyPadding: 15,
                defaults: {
                    labelWidth: 110,
                    margin: '0 0 30 0'
                },
                items: [{
                    xtype: 'button',
                    text: 'Agregar Destino',
                    scope: this,
                    handler: function(){
                        this.items.items[0].items.items[2].setVisible(true);
                    },
                    ui: 'success',
                    scale: 'medium'
                },{
                    xtype: 'textfield',
                    fieldLabel:'Ubicaci&oacute;n Actual',
                    name:'txtOrigen',
                    width: 350
                },{
                    xtype: 'textfield',
                    fieldLabel:'Destino',
                    name:'txtDestino',
                    hidden: true,
                    width: 350
                },{
                    xtype: 'button',
                    text: 'Pedir Taxi',
                    scope: this,
                    margin: '0 0 0 65',
                    width: 200,
                    ui: 'warning',
                    scale: 'large'
                }]
            },{
                flex: 1,
                xtype: 'dataview',
                title: 'Detalles del Taxista',
                scope: this,
                tpl: this.tplTaxista()
            }];

        return items;
    },

    setAddressText: function(address){
         this.items.items[0].items.items[1].setValue(address);
    },

    tplTaxista: function(){
        var imageTpl = new Ext.XTemplate(
            '<div><img height="110" style="border: 2px solid #99BBE8; width:100px; margin: 2px;"  src="images/man.png" ></div>'
        );
        return imageTpl;
    }
});

