Ext.define('App.view.admin.taxistas.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelTaxi',
    requires:['App.view.admin.taxistas.form.FormTaxista', 'App.view.admin.taxistas.GridPanel'],

    layout:'border',

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [
            {
                region:"north",
                height:50,
                border:false,
                bodyPadding:5,
                layout:"column",
                items:this.buildTbar()
            },
            this.getCentro()
        ];
    },

    getCentro:function () {
        return {
            xtype:'gridpanelfilterT',
            region:'center'
        }
    },

    buildTbar:function () {
        return [
            {
                xtype:'button',
                text:'Agregar Taxista',
                scope:this,
                scale:'medium',
                ui:'info',
                handler:this.lanzarForm.bind(this, 'agregar', true)
            }
        ]
    },

    _crearWindowForm:function (c) {
        if (!this.winForm) {
            //si la ventana no se ha creado
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
                buttons:this.buildButtons()
            });
        }
    },

    lanzarForm:function (boton, t, comando) {
        //crear la ventana
        this._crearWindowForm(comando);

        if (boton == "agregar") {
            this.winForm.show();
        }
        else {
            //var record= this.grid.getSeleccionado();
            //abrir para editar
            //this.winForm.show(record);
        }
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
        var form = this.winForm.items.items[0].getForm(),
            obj = form.getValues();

        if (form.isValid()) {
            var invocation = new XMLHttpRequest(),
                url = 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Create?nombre_completo=' + obj.txtName + '&' +
                    'contrasena=' + obj.txtPass + '&direccion=' + obj.txtDireccion + '&telCasa=' + obj.txtTelefono + '&movil=' + obj.txtMovil + '&email=' + obj.txtEmail + '&' +
                    'fechaNac=' + obj.txtNacimiento + '&imei=' + obj.txtImei + '&unidad=' + obj.txtUnidad + '&placas=' + obj.txtPlacas + '&token=' + localStorage.getItem('Logeado');
            if (invocation) {
                invocation.open('POST', url, true);
                invocation.onreadystatechange = function (response) {
                    if (response.target.readyState == 4 && response.target.status == 200) {
                        var r = Ext.decode(response.target.responseText);
                        if (r.result === "ok") {
                            Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
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
