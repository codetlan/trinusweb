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
                region:'east',
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
                    afterrender:function(){
                        this.setPosicionActual(this.createMap.bind(this));
                    }
                }
            }
        ];

        return items;
    },

    buildBbar:function () {
        var _this=this,
            toolbar = Ext.create('Ext.toolbar.Toolbar', {
            xtype:'container',
            items:[{
                xtype:'button',
                text:'Posicion Actual',
                ui: 'success',
                scale: 'medium',
                handler:function(){
                    _this.setPosicionActual(_this.actualizaPosicionCliente.bind(_this))
                }
            },'->', {
                xtype:'button',
                text:'Salir',
                iconCls: 'icon-off icon-white',
                ui: 'danger',
                scale: 'medium',
                handler:_this.salir
            }]
        });

        return toolbar;
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

    pedirTaxi:function (formValues) {
        var _this=this,
            invocation = new XMLHttpRequest(),
            position = _this.markerCliente.getPosition(),
            params = 'idCliente=' + 2 + '&direccion=' + formValues.txtOrigen + '&latitud=' + position.lat() + '&longitud=' + position.lng() +
                '&observ='+formValues.txtObservaciones+'&tokenCliente='+localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/ServletServicioMovil?' + params;
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        Ext.MessageBox.alert('Información', "La petición se ha procesado con éxito.",_this.pedirDatosTaxi.bind(_this));
                    } else {
                        Ext.MessageBox.alert('Información', r.result);
                    }
                }
            }
            invocation.send();
        }
    },

    pedirDatosTaxi:function(){
        var _this=this,
            invocation = new XMLHttpRequest(),
            params = 'idCliente=' + 2 + '&status=ACEPTADO&tokenCliente='+localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/DatosTaxista?' + params;
        _this.items.items[1].el.mask("Buscando al taxista mas cercano, por favor espere...");
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        _this.items.items[1].el.unmask();
                        _this.taxistaOnMap(r);
                    } else {
                        Ext.MessageBox.alert('Información', r.result);
                    }
                }
            }
            invocation.send();
        }
    },
    
    setAddressText:function(address){
        this.items.items[0].items.items[0].setAddressText(address);

    },

    taxistaOnMap:function(response){
        var _this=this,
            latlng = new google.maps.LatLng(response.latitud, response.longitud), //Se crea la coordenada de la posicion actual
            infowindow = new google.maps.InfoWindow();

        var marker = this.addMarker({ //Se crea el marcador de la ubicacion actual
            draggable:true,
            position:latlng,
            map:this.map,
            listeners:{
                dragend:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    _this.setAddressMarker(_this.map, marker, infowindow, marker.getPosition());
                },
                click:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    infowindow.open(_this.map, marker);
                }
            }
        });

        this.setAddressMarker(this.map, marker, infowindow, latlng); //Agregamos la direccion al marcador
    },

    addMarker: function(markerOpts) {
        var marker =  new google.maps.Marker(markerOpts);
        Ext.Object.each(markerOpts.listeners, function(name, fn){
            google.maps.event.addListener(marker, name, fn);
        });
        return marker;
    },

    actualizaPosicionCliente:function(position){
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //Se crea la coordenada de la posicion actual

        this.markerCliente.setPosition(latlng);
        this.setAddressMarker(this.map, this.markerCliente, this.infowindow, this.markerCliente.getPosition());
        this.map.setCenter(latlng);
    }
});