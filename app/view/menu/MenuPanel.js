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


    initComponent:function(){
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function(){
        var items = [
            {
                flex: 1,
                xtype: 'panel',
                html: 'jjksjljlsd',
                title: 'Pide Tu taxy'
            },{
                flex: 1,
                xtype: 'panel',
                html: 'asfgfas',
                title: 'Información del Taxista'
            }];

        return items;
    }
});

