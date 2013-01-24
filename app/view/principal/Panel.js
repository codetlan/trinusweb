Ext.define('App.view.principal.Panel', {
    extend: 'Ext.panel.Panel',
    alias :'widget.panelprincipal',
    requires: ['Ext.toolbar.Toolbar','App.view.maps.MapPanel'],

    layout:'border',

    initComponent:function(){
        this.items = this.buildItems();
        this.bbar = this.buildBbar();

        this.callParent(arguments);
    },

    buildItems:function(){
        var items = [
            {
                xtype:'panel',
                region : 'center',
                flex:1,
                items:[{
                    width: 1500,
                    height: 900,
                    xtype: 'mappanel'
                }]
            },{
                xtype:'panel',
                region : 'east',
                flex:.8,
                html:'jejejejeje'
        }];

        return items;
    },

    buildBbar: function(){
        var toolbar =  Ext.create('Ext.toolbar.Toolbar',{
            width: 700,
            height: 100,
            items: [{
                xtype: 'button',
                text: 'Button'
            }]
        });

        return toolbar;
    }
});