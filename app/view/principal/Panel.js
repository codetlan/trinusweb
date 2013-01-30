Ext.define('App.view.principal.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelprincipal',
    requires:['Ext.toolbar.Toolbar', 'App.view.menu.MenuPanel','App.view.xtemplate.XtemplateTaxista'/*,'App.view.maps.MapPanel'*/],

    layout:'border',


    initComponent:function () {
        this.items = this.buildItems();
        //this.tbar = this.buildBbar();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                xtype: 'panel',
                region:'west',
                bbar: this.buildBbar(),
                flex:2,
                items:[{
                    xtype:'menupanel'
                },{
                    xtype: 'container',
                    items:[{
                        xtype: 'xtemplatetaxista'
                    }]
                }]
            },
            {
                xtype:'container',
                region:'center',
                flex:5,
                html:'<div id="map_canvas" style="height: 100%; width: 100%;"></div>',
                listeners:{
                    scope:this,
                    afterrender:this.onAfterRenderMapPanel
                }
            }
        ];

        return items;
    },

    buildBbar:function () {
        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            xtype:'container',
            items:['->', {
                xtype:'button',
                text:'Salir',
                iconCls: 'icon-off icon-white',
                ui: 'danger',
                scale: 'medium',
                handler:this.salir
            }]
        });

        return toolbar;
    },

    salir:function () {
        localStorage.removeItem('Logeado');
        location.href = 'index.html';
    },

    onAfterRenderMapPanel:function (t, eOpts) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.createMap.bind(this), this.gestionaErroresGeo);
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
            latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude), //Se crea la coordenada de la posicion actual
            infowindow = new google.maps.InfoWindow(); //Globo del marker con información

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions); //Se crea el mapa

        var marker = new google.maps.Marker({ //Se crea el marcador de la ubicacion actual
            draggable:true,
            position:latlng,
            map:this.map
        });

        this.changeAddress(this.map, marker, infowindow, latlng); //Agregamos la direccion al marcador

        google.maps.event.addListener(marker, 'dragend', function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
            _this.changeAddress(this.map, marker, infowindow, marker.getPosition());
        });
    },

    changeAddress:function(map, marker, infowindow, latlng){
        var _this = this, geocoder = new google.maps.Geocoder(); //Servicio para convertir entre latlng y address

        geocoder.geocode({'latLng':latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    map.setZoom(16);

                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                    _this.setAddressText(results[0].formatted_address);
                }
            }
        });
    },

    gestionaErroresGeo:function (err) {
        if (err.code == 0) {
            alert("error desconocido");
        }
        if (err.code == 1) {
            alert("El usuario no ha compartido su posicion");
        }
        if (err.code == 2) {
            alert("no se puede obtener la posicion actual");
        }
        if (err.code == 3) {
            alert("timeout recibiendo la posicion");
        }
    },

    setAddressText:function(address){
        this.items.items[0].items.items[0].setAddressText(address);

    }
});