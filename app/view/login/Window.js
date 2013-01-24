Ext.define('App.view.login.Window', {
    extend: 'Ext.window.Window',
    alias :'widget.windowlogin',
    requires: ['App.view.login.FormPanel'],


    initComponent: function(){

        this.window = Ext.create('Ext.window.Window', {
            title: 'Login',
            width: 280,
            height: 150,
            layout: 'fit',
            closable: false,
            draggable: false,
            id: 'windowlogin'+this.id,
            items:[{
                xtype: 'formpanellogin',
                id:"formpanellogin"+this.id
            }],
            buttons:this.buidlButtons()
        }).show();
    }

});
