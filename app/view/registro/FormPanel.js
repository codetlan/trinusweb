Ext.define('App.view.registro.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formregistrarse',

    defaults:{
        xtype:'textfield',
        labelWidth: 150,
        margin: 10,
        style: {
            fontFamily: 'orbitron-medium'
        },
        width: 380
    },

    initComponent: function(){
        this.items = this.buildItems();
        this.buttons = this.buidlButtons();

        this.callParent(arguments);

    },

    buildItems:function () {
        var items = [
            {
                fieldLabel:'Nombre Completo',
                name:'txtName'
            },{
                fieldLabel:'Movil',
                name:'txtMovil'
            },{
                fieldLabel:'Contraseña',
                name:'txtMovil'
            },{
                fieldLabel:'Confirmaci&oacute;n',
                name:'txtConf'
            },{
                fieldLabel:'Email',
                name:'txtEmail'
            }
        ];

        return items;
    },

    buidlButtons:function(){
        var buttons= [{
            text: 'Cancelar',
            ui: 'danger',
            scale: 'medium',
            iconCls: 'icon-user',
            scope: this,
            handler: function(){
                this.fireEvent("cerrarWindow");
            }

        }, {
            scope: this,
            text: 'Crear',
            ui: 'primary',
            scale: 'medium'
        }];

        return buttons;
    }
});
