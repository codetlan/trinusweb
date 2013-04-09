/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.menu.MenuPanel', {
    extend:'Ext.container.Container',
    alias:'widget.menupanel',
    //requires:['App.view.xtemplate.XtemplateTitulo', 'App.view.menu.FormPanel'],

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                flex: 2,
                layout:'fit',
                xtype:'container',
                html: '<img width="100%"; height="100%"; src="images/titulo.png" title="Trinus">'
            },
            {

                flex: 6,
                xtype:'formpanel',
                layout:{
                    type: 'vbox',
                    align: 'stretch'
                    //pack: 'start'
                },
                listeners:{
                    scope:this,
                    pedirtaxi:function(formValues){
                        this.fireEvent('pedirtaxi',formValues);
                    }
                }
            }
        ];

        return items;
    },

    setAddressText:function (address) {
        this.items.items[1].items.items[0].setValue(address);
    }
});

