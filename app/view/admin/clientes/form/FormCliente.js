Ext.define('App.view.admin.clientes.form.FormCliente', {
    extend:'Ext.form.FormPanel',
    alias:'widget.formclientes',

    layout: 'form',
    bodyPadding: 10,
    defaultType:'textfield',
    defaults: {
        labelWidth: 140,
        allowBlank: false
        //vtype: 'alphanum'
    },

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                fieldLabel:'Nombre Completo',
                name:'txtName',
                vtype:'alpha'
            },
            {
                fieldLabel:'Movil',
                name:'txtMovil'
            },
            {
                fieldLabel:'Email',
                name:'txtEmail',
                vtype: 'email'
            },
            {
                fieldLabel:'Contraseña',
                name:'txtPass',
                vtype:'alphanum'
            }
        ];

        return items;
    }

});

