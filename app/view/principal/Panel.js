Ext.define('App.view.principal.Panel', {
    extend: 'Ext.panel.Panel',
    alias :'widget.panelprincipal',

    layout:'border',

    initComponent:function(){
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function(){
        var items = [
            {
                xtype:'panel',
                region : 'north',
                height:100,
                html:'jijijijjiji'
            },{
                xtype:'panel',
                region : 'west',
                flex:1,
                html:'jajajjajajaja'
            },{
                xtype:'panel',
                region : 'center',
                flex:1,
                html:'jojojojo'
            },{
                xtype:'panel',
                region : 'east',
                flex:1,
                html:'jejejejeje'
            }
        ];

        return items;
    }
});