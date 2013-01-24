Ext.define('App.view.login.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formpanellogin',

    defaults:{
        xtype:'textfield',
        margin:5,
        allowBlank:false,
        vtype:'alphanum',
        labelWidth: 80
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
                value: '2299123456'
            },{
                fieldLabel:'Password',
                inputType:'password',
                name:'txtPass',
                value: 'arnold'
            }
        ];

        return items;
    }
});
