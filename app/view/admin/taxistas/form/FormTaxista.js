Ext.define('App.view.admin.taxistas.form.FormTaxista', {
    extend:'Ext.form.FormPanel',
    alias:'widget.formtaxistas',

    layout: 'form',
    bodyPadding: 10,
    defaultType:'textfield',
    defaults: {
        labelWidth: 140,
        allowBlank: false,
        vtype: 'alphanum'
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
                fieldLabel:'Fecha de Nacimiento',
                name:'txtNacimiento'
            },
            {
                fieldLabel:'Direcci&oacute;n',
                name:'txtDireccion'
            },
            {
                fieldLabel:'Tel. Casa',
                name:'txtTelefono'
            },
            {
                fieldLabel:'Movil',
                name:'txtMovil'
            },
            {
                fieldLabel:'IMEI',
                name:'txtImei'
            },
            {
                fieldLabel:'Unidad',
                name:'txtUnidad'
            },
            {
                fieldLabel:'Placas',
                name:'txtPlacas'
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
