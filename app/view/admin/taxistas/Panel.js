Ext.define('App.view.admin.taxistas.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelTaxi',
    requires:['App.view.admin.taxistas.form.FormTaxista', 'App.view.admin.taxistas.GridPanel'],

    layout:'border',
    esSitio:undefined,

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [{
            xtype:'gridpanelfilterT',
            region:'center',
            esSitio:this.esSitio,
            listeners: {
                scope: this,
                mask: function(){
                    this.items.items[0].mask('Cargando....');
                },
                unmask: function(){
                    this.items.items[0].unmask();
                }
            }
        }];
    }
});
