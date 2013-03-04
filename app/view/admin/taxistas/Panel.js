Ext.define('App.view.admin.taxistas.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelTaxi',
    requires:['App.view.admin.taxistas.form.FormTaxista', 'App.view.admin.taxistas.GridPanel'],

    layout:'border',
    esSitio:undefined,

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [this.getCentro()];
    },

    getCentro:function () {
        return {
            xtype:'gridpanelfilterT',
            region:'center',
            esSitio:this.esSitio,
            listeners: {
                scope: this,
                mask: function(){
                    this.items.items[0].mask('Cargando....');
                },
                unmask: function(){
                    this.items.items[0].unmask();
                }
            }
        }
    },

    lanzarForm:function () {
        this.fireEvent('maskara');
        this.winForm = Ext.create('Ext.window.Window', {
            title:'Agregar Taxista',
            width:500,
            height:450,
            draggable:false,
            layout:'fit',
            items:[
                {
                    xtype:'formtaxistas'
                }
            ],
            buttons:this.buildButtons(),
            listeners: {
                scope: this,
                destroy: function (){
                    this.fireEvent('unmaskara');
                }
            }
        }).show();
    },

    buildButtons:function () {
        return [
            {
                xtype:'button',
                text:'Agregar',
                scope:this,
                ui:'warning',
                scale:'medium',
                handler:this.agregarTaxista
            }
        ];
    },

    agregarTaxista:function () {
        var _this=this, form = this.winForm.items.items[0].getForm(),
            obj = form.getValues();

        if (form.isValid()) {
            var invocation = new XMLHttpRequest(),
                params = '?nombre_completo=' + obj.txtName + '&' +
                    'contrasena=' + obj.txtPass + '&direccion=' + obj.txtDireccion + '&telCasa=' + obj.txtTelefono + '&movil=' + obj.txtMovil + '&email=' + obj.txtEmail + '&' +
                    'fechaNac=' + obj.txtNacimiento + '&imei=' + obj.txtImei + '&unidad=' + obj.txtUnidad + '&placas=' + obj.txtPlacas + '&token=' + localStorage.getItem('Logeado');

            if(this.esSitio){
                params += params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idUsuario;
            }

            if (invocation) {
                invocation.open('POST', 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Create' + params, true);
                invocation.onreadystatechange = function (response) {
                    if (response.target.readyState == 4 && response.target.status == 200) {
                        var r = Ext.decode(response.target.responseText);
                        if (r.result === "ok") {
                            _this.items.items[1].body.mask('Cargando....');
                            _this.items.items[1].store.load();
                            _this.items.items[1].body.unmask();
                            //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                        } else {
                            Ext.MessageBox.alert('Información', r.result);
                        }
                    }
                }
                invocation.send();
            }
            this.winForm.destroy();
        }
    }





});
