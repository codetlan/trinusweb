Ext.define('App.view.admin.clientes.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelCliente',
    requires:['App.view.admin.clientes.form.FormCliente', 'App.view.admin.clientes.GridPanel'],

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
            xtype:'gridpanelfilterC',
            region:'center'
        }
    },

    buildTbar:function () {
        return [
            {
                xtype:'button',
                text:'Agregar Cliente',
                scope:this,
                scale:'medium',
                ui:'info',
                handler:this.lanzarForm
            }
        ]
    },

    lanzarForm:function () {
        this.fireEvent('maskara');
        this.winForm = Ext.create('Ext.window.Window', {
            title:'Agregar Cliente',
            width:500,
            height:250,
            draggable:false,
            layout:'fit',
            items:[
                {
                    xtype:'formclientes'
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
                handler:this.agregarCliente
            }
        ];
    },

    agregarCliente:function () {
        var _this= this, form = this.winForm.items.items[0].getForm(),
            obj = form.getValues();

        if (form.isValid()) {
            var invocation = new XMLHttpRequest(),
                url = 'http://isystems.com.mx:8181/Trinus/ServletCliente/Create?nombre_completo=' + obj.txtName + '&' +
                    'contrasena=' + obj.txtPass + '&movil=' + obj.txtMovil + '&email=' + obj.txtEmail + '&' +
                    '&token=' + localStorage.getItem('Logeado');
            if (invocation) {
                invocation.open('POST', url, true);
                invocation.onreadystatechange = function (response) {
                    if (response.target.readyState == 4 && response.target.status == 200) {
                        var r = Ext.decode(response.target.responseText);
                        if (r.result === "ok") {
                            _this.items.items[1].body.mask('Cargando....');
                            _this.items.items[1].store.load();
                            _this.items.items[1].body.unmask();
                            //Ext.MessageBox.alert('Información', "Se agrego el cliente correctamente");
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

