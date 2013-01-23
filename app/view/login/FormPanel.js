Ext.define('App.view.login.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formpanellogin',

    defaults:{
        xtype:'textfield',
        margin:5,
        allowBlank:false/*,
        vtype:'alphanum'*/
    },

    initComponent: function(){

        this.items = this.buildItems();

        this.callParent(arguments);

    },

    buildItems:function () {
        var items = [
            {
                fieldLabel:'Usuario',
                name:'txtUser',
                labelWidth:50
            },{
                fieldLabel:'Password',
                inputType:'password',
                labelWidth:60,
                name:'txtPass'
            }
        ];

        return items;
    }
});
