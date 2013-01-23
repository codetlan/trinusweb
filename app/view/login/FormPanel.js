Ext.define('App.view.login.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formpanellogin',

    initComponent: function(){
        Ext.create('Ext.form.Panel', {
            title: 'Simple Form',
            // The fields
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'First Name',
                name: 'first',                //this name must match with the field name in the model
                allowBlank: false
            },{
                fieldLabel: 'Last Name',
                name: 'last',
                allowBlank: false
            }],

            // Reset and Submit buttons
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true,
                disabled: true,
                handler: function() {
                }
            }]
        });

    }
});
