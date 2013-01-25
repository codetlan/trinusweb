Ext.define('App.view.principal.Panel', {
    extend: 'Ext.panel.Panel',
    alias :'widget.panelprincipal',
    requires: ['Ext.toolbar.Toolbar','App.view.menu.MenuPanel','App.view.maps.MapPanel'],

    layout:'border',


    initComponent:function(){
        this.items = this.buildItems();
        this.tbar = this.buildBbar();

        this.callParent(arguments);
    },

    buildItems:function(){
        var items = [
            /*{
                layout: 'form',
                region: 'north',
                items: [this.buildBbar()]
            },*/
            {
                xtype:'container',
                layout: 'fit',
                region : 'west',
                flex:.2,
                items: [{
                    xtype: 'menupanel'
                }]
            },{
                xtype:'panel',
                layout: 'fit',
                region : 'center',
                flex: 1,
                items:[{
                    xtype: 'mappanel'
                }]
            }];

        return items;
    },

    buildBbar: function(){
        var toolbar =  Ext.create('Ext.toolbar.Toolbar',{
            xtype: 'container',
            items: [{
                xtype: 'button',
                text: 'Usuario',
                icon: 'images/user.png'
            },{
                xtype: 'button',
                text: 'Salir',
                icon: 'images/user.png',
                handler: this.salir
            }]
        });

        return toolbar;
    },

    salir: function(){
        localStorage.removeItem('Logeado');
        location.href='index.html';
    }
});