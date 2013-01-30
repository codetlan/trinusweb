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
    requires:['App.view.xtemplate.XtemplateTitulo', 'App.view.menu.FormPanel'],

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                layout:'fit',
                xtype:'xtemplatetitulo'
            },
            {
                layout: 'form',
                xtype:'formpanel'
            }
        ];

        return items;
    },

    setAddressText:function (address) {
        this.items.items[1].items.items[0].setValue(address);
    }
});

