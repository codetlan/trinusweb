Ext.define('App.view.admin.servicios.historial.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelHistorial',
    //requires:['App.view.admin.servicios.historial.GridPanel'],

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
            esSitio:this.esSitio,
            listeners: {
                scope: this,
                mask: function(){
                    console.info(this.items.items[0].body);
                    this.items.items[0].el.mask('Cargando....');
                },
                unmask: function(){
                    this.items.items[0].el.unmask();
                }
            }
        }
    }
});
