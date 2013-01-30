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
                    xtype:'menupanel',
                    listeners:{
                        scope:this,
                        pedirtaxi:this.pedirTaxi
                    }
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

        google.maps.event.addListener(marker, 'click', function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
            infowindow.open(this.map, marker);
        });
    },

    changeAddress:function (map, marker, infowindow, latlng) {
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

    pedirTaxi:function () {
        var invocation = new XMLHttpRequest(),
            params = 'idCliente=' + 2 + '&direccion=' + '"Cjon. de Las Plalyas, Pedregal de Carrasco, Coyoacán"' + '&latitud=' + 19.3103351 + '&longitud=' + -99.1703636 +
                '&observ="algunaobservacion"',
            url = 'http://isystems.com.mx:8181/Trinus/ServletServicioMovil?' + params;

        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = this.onPedirTaxiResponse.bind(this)
            invocation.send();
        }
    },

    onPedirTaxiResponse:function (response) {
        console.info(response);
        /**
         * direccion: ""Cjon. de Las Plalyas, Pedregal de Carrasco, Coyoacán""
         estatus: "ASIGNADO"
         idcliente: 2
         idservicio: 48
         idtaxista: 1
         latitud: "19.3103351"
         longitud: "-99.1703636"
         result: "ok"
         unidad: "1401"
         */
        if (response.target.readyState == 4 && response.target.status == 200) {
            var r = response.target.responseText ? Ext.decode(response.target.responseText) : "";
            if (r.result === "ok") {

            } else {
                Ext.MessageBox.alert('Status', r.result);
            }
        }
    },
    
    setAddressText:function(address){
        this.items.items[0].items.items[0].setAddressText(address);

    }
});