/**
 * Created with JetBrains PhpStorm.
 * User: lumartin
 * Date: 06/03/13
 * Time: 17:22
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.admin.servicios.asignar.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelAsignar',
    requires:['App.view.admin.servicios.asignar.GridPanel'],

    layout:'border',
    esSitio:undefined,

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [{
            xtype:'gridpanelAsignar',
            region:'center',
            esSitio:this.esSitio
        }];
    }
});
