Ext.define('App.view.admin.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelprincipaladmin',
    requires:['App.view.admin.MenuAdminPanel','App.view.admin.taxistas.Panel','App.view.admin.clientes.Panel'],

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
                text:'Salir',
                iconCls:'icon-off icon-white',
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
        var _this = this,
            mapOptions = { //Se crean las opciones basicas del mapa
                zoom:14,
                center:new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                mapTypeId:google.maps.MapTypeId.ROADMAP
            },
            latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //Se crea la coordenada de la posicion actual
        this.infowindow = new google.maps.InfoWindow(); //Globo del marker con información

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions); //Se crea el mapa

        this.markerCliente = this.addMarker({ //Se crea el marcador de la ubicacion actual
            draggable:true,
            position:latlng,
            map:this.map,
            listeners:{
                dragend:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    _this.setAddressMarker(_this.map, _this.markerCliente, _this.infowindow, _this.markerCliente.getPosition());
                },
                click:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    _this.infowindow.open(_this.map, _this.markerCliente);
                }
            }
        });

        this.setAddressMarker(this.map, _this.markerCliente, _this.infowindow, latlng); //Agregamos la direccion al marcador
    },

    setAddressMarker:function (map, marker, infowindow, latlng) {
        var _this = this, geocoder = new google.maps.Geocoder(); //Servicio para convertir entre latlng y address

        geocoder.geocode({'latLng':latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    map.setZoom(16);

                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                }
            }
        });
    },

    addMarker:function (markerOpts) {
        var marker = new google.maps.Marker(markerOpts);
        Ext.Object.each(markerOpts.listeners, function (name, fn) {
            google.maps.event.addListener(marker, name, fn);
        });
        return marker;
    }

});