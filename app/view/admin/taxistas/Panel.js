Ext.define('App.view.admin.taxistas.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelTaxistas',
    requires:'App.view.admin.taxistas.form.FormTaxista',


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
        return [
            {
                xtype:'container',
                region:'center'
            }
        ];
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
            },
            {
                xtype:'button',
                text:'Editar Taxista',
                scope:this,
                scale:'medium',
                ui:'info'
            },
            {
                xtype:'button',
                text:'Eliminar Taxista',
                scope:this,
                scale:'medium',
                ui:'info'
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
        console.info(comando);
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
        /*var form = this.getForm(),
         obj = form.getValues();
         if(form.isValid()){  */
        var _this = this,
            invocation = new XMLHttpRequest(),
            params = 'idCliente=' + 2 + '&status=ACEPTADO&token=' + localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Create?nombre_completo=oswaldo lopez&contrasena=prueba&direccion=Privade de Benito Juarez&telCasa=52430356&movil=5513899832&email=oswaldo@codetlan.com&fechaNac=10 Octubre 1986&imei=244523543545&unidad=546gtr65&latitud=19&longitud=20&gcm=24567644&placas=343556643&token='+localStorage.getItem('Logeado');
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        Ext.MessageBox.alert('Información', "La petición se ha procesado con éxito.");
                    } else {
                        Ext.MessageBox.alert('Información', r.result);
                    }
                }
            }
            invocation.send();
        }
    }





});
