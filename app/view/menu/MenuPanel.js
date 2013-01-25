/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.menu.MenuPanel', {
    extend: 'Ext.panel.Panel',
    alias :'widget.menupanel',


    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent:function(){
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function(){
        var items = [
            {
                flex: 1,
                xtype: 'panel',
                title: 'Pide Tu taxi'
            },{
                flex: 1,
                xtype: 'panel',
                html: 'asfgfas',
                title: 'Información del Taxista'
            }];

        return items;
    }
});

