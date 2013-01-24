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
        this.buttons = this.buidlButtons();

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
    },

    buidlButtons:function(){
        var buttons= [{
            text: 'Reset',
            handler: function() {
                this.getForm().reset();
            }
        }, {
            scope: this,
            text: 'Login',
            handler: this.logeo
        }];

        return buttons;
    },

    logeo:function(){
        var form = this.getForm(),
            obj = form.getValues();
        if(form.isValid()){
            Ext.Ajax.request({
                scope: this,
                url: 'proxy.php?url=http%3A%2F%2Fisystems.com.mx%3A8181%2FTrinus%2FServletLoginCliente%3Fmovil%3D'
                    +obj.txtUser+'%26password%3D'+ obj.txtPass,
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    if(r.result === "ok"){
                        localStorage.setItem("Logeado", 1);//Se guarda un identificador para no perder la session
                        this.fireEvent("logeado");
                    } else{
                        //Notification.warn(r.error);
                    }
                }
            });

        }
    }
});
