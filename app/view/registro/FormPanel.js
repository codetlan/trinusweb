Ext.define('App.view.registro.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formregistrarse',

    defaults:{
        xtype:'textfield',
        labelWidth: 150,
        allowBlank:false,
        vtype:'alphanum',
        margin: 10,
        style: {
            fontFamily: 'orbitron-medium'
        },
        width: 380
    },

    initComponent: function(){
        this.items = this.buildItems();
        this.buttons = this.buidlButtons();
        this.aplicarVtypes();

        this.callParent(arguments);
    },

    buildItems:function () {


        var items = [
            {
                fieldLabel:'Nombre Completo',
                name:'txtName',
                vtype:'nombre'
            },{
                fieldLabel:'Movil',
                name:'txtMovil',
                vtype:'num'
            },{
                fieldLabel:'Contraseña',
                inputType:'password',
                id:'contrasena'+this.id,
                name:'txtPass'
            },{
                fieldLabel:'Confirmaci&oacute;n',
                inputType:'password',
                name:'txtConf'
            },{
                fieldLabel:'Email',
                name:'txtEmail',
                vtype:'email',
                value:'a@a.com'
            }
        ];

        return items;
    },

    buidlButtons:function(){
        var _this=this,
            buttons= [{
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
            scale: 'medium',
            handler:function(){
                console.info(this.form.isValid());
                console.info(this.form.getValues());
                if(this.form.isValid()){
                    var valores = this.form.getValues();
                    if(valores.txtPass === valores.txtConf){
                        _this.registrar(valores);
                    } else {
                        Ext.getCmp('contrasena'+_this.id).markInvalid("Las contraseñas no coinciden.");
                    }
                }
            }
        }];

        return buttons;
    },

    registrar:function(values){
        var _this=this,
            invocation = new XMLHttpRequest(),
            params = 'nombre_completo=' + values.txtName + '&movil=' + values.txtMovil + '&contrasena=' + values.txtPass + '&email=' + values.txtEmail,
            url = 'http://isystems.com.mx:8181/Trinus/ServletCreateClienteMovil?' + params;
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        Ext.MessageBox.alert('Información', "Enhorabuena"+ values.txtName + ", Ahora puedes ingresar al sistema.", _this.fireEvent("cerrarWindow"));
                    } else {
                        Ext.MessageBox.alert('Información', r.result);
                    }
                }
            }
            invocation.send();
        }
    },

    aplicarVtypes:function(){
        Ext.apply(Ext.form.field.VTypes, {
            //  vtype validation function
            nombreMask:/^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/,
            nombreText:'Nombre no v&aacute;lido',
            nombre:function(val,field){
                var regExp=/^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/;
                ///^[a-zA-Z ][-_.a-zA-Z0-9 ]{0,30}$/;
                return regExp.test(val);
            },
            numMask:/[\d\$.]/,
            num:function(val,field){
                return val;
            }
        });
    }
});
