Ext.define('App.view.admin.taxistas.form.FormTaxista', {
    extend:'Ext.form.FormPanel',
    alias:'widget.formtaxistas',

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
                fieldLabel:'Fecha de Nacimiento',
                name:'txtNacimiento',
                xtype: 'datefield',
                format: 'Y/m/d'
            },
            {
                fieldLabel:'Direcci&oacute;n',
                name:'txtDireccion'
            },
            {
                fieldLabel:'Tel. Casa',
                name:'txtTelefono',
                maxLength: 10
            },
            {
                fieldLabel:'Movil',
                name:'txtMovil',
                maxLength: 10
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
