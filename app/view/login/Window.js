Ext.define('App.view.login.Window', {
    extend: 'Ext.window.Window',
    alias :'widget.windowlogin',
    requires: ['App.view.login.FormPanel'],


    initComponent: function(){

        this.window = Ext.create('Ext.window.Window', {
            title: 'Login',
            width: 280,
            height: 150,
            layout: 'fit',
            closable: false,
            draggable: false,
            id: 'windowlogin'+this.id,
            items:[{
                xtype: 'formpanellogin',
                id:"formpanellogin"+this.id
            }],
            buttons:this.buidlButtons()
        }).show();
    },

    buidlButtons:function(){
        var buttons= [{
            text: 'Reset',
            handler: function() {
                this.up('window').items.items[0].getForm().reset();
            }
        }, {
            text: 'Login',
            handler: this.logeo.bind(this)
        }];

        return buttons;
    },

    logeo:function(){
        var form = this.window.items.items[0].getForm(),
            obj = form.getValues();
        if(form.isValid()){
            Ext.Ajax.request({
                scope: this,
                url: 'proxy.php?url=http%3A%2F%2Fisystems.com.mx%3A8181%2FTrinus%2FServletLoginCliente%3Fmovil%3D'
                    +obj.txtUser+'%26password%3D'+ obj.txtPass,
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    if(r.result === "ok"){
                        this.window.hide();
                        this.fireEvent("logeado");
                    } else{
                        //Notification.warn(r.error);
                    }
                }
            });

        }
    }

});
