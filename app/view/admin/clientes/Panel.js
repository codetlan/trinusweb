Ext.define('App.view.admin.clientes.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelCliente',
    requires:['App.view.admin.clientes.form.FormCliente', 'App.view.admin.clientes.GridPanel'],

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
            xtype:'gridpanelfilterC',
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
        }
    }
});

