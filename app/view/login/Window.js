Ext.define('App.view.login.Window', {
    extend: 'Ext.window.Window',
    alias :'widget.windowlogin',
    requires: ['App.view.login.FormPanel'],


    initComponent: function(){

        Ext.create('Ext.window.Window', {
            title: 'Login',
            width: 600,
            height: 400,
            layout: 'fit',
            id: 'windowlogin',
            items:[{
                xtype: 'formpanellogin'
            }]
        }).show();
    }

});
