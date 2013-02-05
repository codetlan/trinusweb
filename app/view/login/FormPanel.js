Ext.define('App.view.login.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formpanellogin',
    requires:['App.view.registro.FormPanel'],

    defaults:{
        xtype:'textfield',
        margin:5,
        allowBlank:false,
        //vtype:'alphanum',
        labelWidth: 110,
        style: {
            fontFamily: 'orbitron-medium'
        }
    },

    initComponent: function(){

        this.items = this.buildItems();
        this.buttons = this.buidlButtons();

        this.callParent(arguments);

    },

    buildItems:function () {
        var items = [
            {
                fieldLabel:'Usuario',
                name:'txtUser',
                value: '9876543210'
            },{
                fieldLabel:'Password',
                inputType:'password',
                name:'txtPass',
                value: '111'
            }
        ];

        return items;
    },

    buidlButtons:function(){
        var buttons= [{
            text: 'Registrate',
            ui: 'info',
            scale: 'medium',
            iconCls: 'icon-user icon-white',
            scope: this,
            handler: this.windowRegistrarse
        }, {
            scope: this,
            text: 'Ingresa',
            ui: 'primary',
            scale: 'medium',
            handler: this.logeo
        }];

        return buttons;
    },

    logeo:function(){
        var form = this.getForm(),
            obj = form.getValues();
        if(form.isValid()){
            var invocation=new XMLHttpRequest(),
                url = 'http://isystems.com.mx:8181/Trinus/ServletLogin?movil='+obj.txtUser+'&password='+ obj.txtPass;
            if(invocation) {
                invocation.open('POST', url, true);
                invocation.onreadystatechange = this.logear.bind(this);
                invocation.send();
            }
        }
    },

    logear:function(response){
        if (response.target.readyState == 4 && response.target.status == 200) {
            var r = Ext.decode(response.target.responseText);
            if (r.result === "ok") {
                localStorage.setItem("Logeado", r.token);//Se guarda un identificador para no perder la session
                localStorage.setItem("Usuario", r.usuario);
                this.fireEvent("logeado", r);
            } else {
                Ext.MessageBox.alert('Status', r.result);
            }
        }
    },

    windowRegistrarse:function(){
        this.window = Ext.create('Ext.window.Window', {
            title: 'Ingresa tus Datos',
            width: 415,
            height: 336,
            draggable: false,
            layout: 'fit',
            items:[{
                xtype: 'formregistrarse',
                listeners:{
                    scope: this,
                    cerrarWindow: function(){
                        this.window.destroy();
                    }

                }
            }]
        }).show();
    }
});
