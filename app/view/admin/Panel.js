Ext.define('App.view.admin.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelprincipaladmin',
    requires:['App.view.admin.MenuAdminPanel','App.view.admin.taxistas.Panel','App.view.admin.clientes.Panel','App.view.xtemplate.XtemplateTaxista'],

    layout:'border',


    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var _this = this, items = [
            {
                descargas:[],
                xtype:"menuadmin",
                region:"west",
                title:"Menu",
                id: "Menu"+this.id,
                bbar:this.buildBbar(),
                flex:1,
                scope:this,
                opciones:[
                    {
                        iconCls:"icon-user",
                        text:"Clientes",
                        scope:this,
                        cls: "cliente"
                    },
                    {
                        iconCls: "icon-hand-right",
                        text:"Taxistas",
                        scope:this,
                        cls: "taxi"
                    },
                    {
                        iconCls: 'icon-list-alt',
                        text: 'Historial de Servicios',
                        scope: this,
                        cls: 'historial'
                    }
                ],
                listeners:{
                    opcion:function (titulo) {
                        _this.agregarTabpanel(titulo);
                    }
                }
            },
            {
                xtype:'tabpanel',
                region:'center',
                flex:5,
                activeTab:0,
                items:[
                    {
                        title:'Mapa',
                        html:'<div id="map_canvas" style="height: 100%; width: 100%;"></div>',
                        listeners:{
                            scope:this,
                            afterrender:function () {
                                this.setPosicionActual(this.createMap.bind(this));
                            }
                        }
                    }
                ]
            }
        ];

        return items;
    },

    buildBbar:function () {
        var _this = this,
            bbar = ['->', {
                xtype:'button',
                text:'<span style="color:#FFF;">Salir</span>',
                iconCls:'icon-off',
                ui:'danger',
                scale:'medium',
                handler:_this.salir
            }];

        return bbar;
    },

    agregarTabpanel:function (titulo) {
        if(Ext.isEmpty(this.items.items[0].descargas[titulo]) ){
            this.items.items[0].descargas[titulo]= titulo;
            this.items.items[1].add({xtype:"panel"+titulo, title:titulo, closable:true, id:titulo+this.id});
        }
        this.items.items[1].setActiveTab(titulo+this.id);
    },

    salir:function () {
        localStorage.removeItem('Logeado');
        localStorage.removeItem('recordUsuario');
        location.href = 'index.html';
    },

    setPosicionActual:function (fn) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fn, this.gestionaErroresGeo);
        } else {
            alert('Tu navegador no soporta la API de geolocalizacion');
        }
    },

    createMap:function (position) {
        var mapOptions = { //Se crean las opciones basicas del mapa
                zoom:14,
                center:new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                mapTypeId:google.maps.MapTypeId.ROADMAP
            }; //Se crea la coordenada de la posicion actual
        this.infowindow = new google.maps.InfoWindow(); //Globo del marker con información
        this.arrTaxisMarkers = [];

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions); //Se crea el mapa

        var runner = new Ext.util.TaskRunner();
        var task = runner.start({
            run: this.pedirTaxistas.bind(this),
            interval: 1000
        });
    },

    addMarker:function (markerOpts) {
        var marker = new google.maps.Marker(markerOpts);
        Ext.Object.each(markerOpts.listeners, function (name, fn) {
            google.maps.event.addListener(marker, name, fn);
        });
        return marker;
    },

    pedirTaxistas:function(){
        var _this=this,
            invocation = new XMLHttpRequest(),
            params = 'token='+localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/ServletTaxistas?'+params;
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        _this.addTaxistasOnMap(r);
                    } else {
                        Ext.MessageBox.alert('Información', r.result);
                    }
                }
            }
            invocation.send();
        }
    },

    addTaxistasOnMap:function (response) {console.info(response);
        var _this = this;
        Ext.each(response.data, function (taxista) {
            if (taxista.latitud !== "") {
                var latlng = new google.maps.LatLng(taxista.latitud, taxista.longitud); //Se crea la coordenada de la posicion actual,
                if (Ext.isEmpty(_this.arrTaxisMarkers[taxista.idTaxista])) {

                    var marker = _this.addMarker({
                        position:latlng,
                        map:_this.map,
                        draggable:true,
                        listeners:{
                            click:function () {
                                var content = "Hola " + taxista.nombreCompleto,
                                    infowindow = new google.maps.InfoWindow({
                                        content:_this.xtemplateTaxista()
                                    });
                                infowindow.open(_this.map, marker);
                            }
                        }
                    });
                    _this.arrTaxisMarkers[taxista.idTaxista] = marker;
                    _this.map.getBounds().extend(latlng);
                } else {
                    _this.arrTaxisMarkers[taxista.idTaxista].setPosition(latlng);
                }
            }
        });
        _this.map.setCenter(_this.map.getBounds().getCenter());
        //_this.map.fitBounds(_this.map.getBounds());
        //_this.map.panToBounds(_this.map.getBounds());
    },

    xtemplateTaxista: function(){
        this.tpl = Ext.create('App.view.xtemplate.XtemplateTaxista', {}).show();

    }

});