Ext.define('App.view.admin.servicios.historial.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelHistorial',
    requires:['App.view.admin.servicios.historial.GridPanel'],

    layout:'border',
    esSitio:undefined,

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [this.getCentro()];
    },

    getCentro:function () {
        return {
            xtype:'gridpanelfilterH',
            region:'center',
            esSitio:this.esSitio
        }
    }
});