Ext.define('App.view.principal.Panel', {
    extend: 'Ext.panel.Panel',
    alias :'widget.panelprincipal',
    requires: ['Ext.toolbar.Toolbar','App.view.menu.MenuPanel','App.view.maps.MapPanel'],

    layout:'border',

    initComponent:function(){
        this.items = this.buildItems();
        this.bbar = this.buildBbar();

        this.callParent(arguments);
    },

    buildItems:function(){
        var items = [
            {
                xtype:'container',
                region : 'west',
                items: [{
                    width: 200,
                    height: 400,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    xtype: 'menupanel'
                }]
            },{
                xtype:'panel',
                region : 'center',
                flex:1,
                items:[{
                    width: 1500,
                    height: 900,
                    xtype: 'mappanel'
                }]
            }];

        return items;
    },

    buildBbar: function(){
        var toolbar =  Ext.create('Ext.toolbar.Toolbar',{
            width: 700,
            height: 100,
            items: [{
                xtype: 'button',
                text: 'Buttonn'
            }]
        });

        return toolbar;
    }
});