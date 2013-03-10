Ext.define('App.view.principal.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelprincipal',
    requires:['Ext.toolbar.Toolbar', 'App.view.menu.MenuPanel','App.view.xtemplate.XtemplateTaxista','App.view.recarga.FormPanel'],

    layout:'border',


    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        this.tplTaxista = Ext.create('App.view.xtemplate.XtemplateTaxista',{
            data:{
            nombre:''
        }});
        var items = [
            {
                xtype: 'panel',
                region:'east',
                bbar: this.buildBbar(),
                flex:2,
                layout:{
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'start'
                },
                items:[{
                    flex: 7,
                    xtype:'menupanel',
                    layout:{
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    listeners:{
                        scope:this,
                        pedirtaxi:this.pedirTaxi
                    }
                },{
                    flex: 4,
                    xtype: 'container',
                    items:[this.tplTaxista]
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
            layout: 'hbox',
            items:[{
                xtype:'button',
                text: 'Posición',
                flex: 1,
                ui: 'inverse',
                iconCls: 'icon-map-marker icon-white',
                scale: 'medium',
                handler:function(){
                    _this.setPosicionActual(_this.actualizaPosicionCliente.bind(_this))
                }
            },{
                xtype: 'button',
                text: 'Recarga',
                flex: 1,
                ui: 'warning',
                iconCls: 'icon-shopping-cart icon-white',
                scale: 'medium',
                scope: this,
                handler: _this.recargaSaldo
            }, {
                xtype:'button',
                text:'Salir',
                flex: 1,
                ui: 'inverse',
                iconCls: 'icon-off icon-white',
                scale: 'medium',
                handler:_this.salir
            }]
        });

        return toolbar;
    },

    salir:function () {
        localStorage.removeItem('Logeado');
        localStorage.removeItem('Usuario');
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
        console.log('actual position: ');
        console.log(position);
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
            animation:google.maps.Animation.DROP,
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
        this.autoCompleteOnDestino(position);
    },

    setAddressMarker:function (map, marker, infowindow, latlng, sinAddressText) {
        var _this = this, geocoder = new google.maps.Geocoder(); //Servicio para convertir entre latlng y address

        geocoder.geocode({'latLng':latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    map.setZoom(16);

                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                    if(!sinAddressText){
                        _this.setAddressText(results[0].formatted_address);
                    }
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
            params = 'idCliente=' + Ext.decode(localStorage.getItem('Usuario')).idCliente +
                '&direccion=' + formValues.txtOrigen + '&latitud=' + position.lat() + '&longitud=' + position.lng() +
                '&observ='+formValues.txtObservaciones+'&token='+localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/ServletServicioMovil?' + params;
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        Ext.MessageBox.alert('Información', "La petición se ha procesado con éxito.",_this.pedirDatosTaxi.bind(_this, r.idServicio));
                    } else {
                        Ext.MessageBox.alert('Información', r.result);

                    }
                }
            }
            invocation.send();
        }
    },

    pedirDatosTaxi:function(idServicio){
        var _this=this,
            invocation = new XMLHttpRequest(),
            params = 'idServicio=' + idServicio +
                '&estatus=ACEPTADO&token='+localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/DatosTaxista?' + params;
        _this.items.items[1].el.mask("Buscando al taxista mas cercano, por favor espere...");
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        _this.items.items[1].el.unmask();
                        _this.taxistaOnMap(r, idServicio);
                    } else {
                        Ext.MessageBox.alert('Información', r.result+'. Por Favor Pide Taxi!!! Nuevamente');
                        _this.items.items[1].el.unmask();
                    }
                }
            }
            invocation.send();
        }
    },
    
    setAddressText:function(address){
        this.items.items[0].items.items[0].setAddressText(address);

    },

    taxistaOnMap:function(response, idServicio){
        var _this=this,
            latlng = new google.maps.LatLng(response.latitud, response.longitud), //Se crea la coordenada de la posicion actual
            infowindow = new google.maps.InfoWindow();

        this.markerTaxista = this.addMarker({ //Se crea el marcador de la ubicacion actual
            draggable:true,
            position:latlng,
            map:this.map,
            icon: 'images/trinus.png',
            animation:google.maps.Animation.DROP,
            listeners:{
                dragend:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    _this.setAddressMarker(_this.map, this.markerTaxista, infowindow, this.markerTaxista.getPosition());
                },
                click:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    infowindow.open(_this.map, this.markerTaxista);
                }
            }
        });

        this.setAddressMarker(this.map, this.markerTaxista, infowindow, latlng); //Agregamos la direccion al marcador
        this.taxistaEnLugar(idServicio); //Hacer la petición para saber cuando el taxista este en el lugar del servicio solicitado
        this.datosTaxista(response); //Se envian datos del taxista al xtemplate

        this.runner = new Ext.util.TaskRunner();

        this.runner.start({
            run:this.updateTaxiPosition.bind(this, [response]),
            interval:10000
        });
    },

    updateTaxiPosition:function(taxista){
        console.log('update taxista: ');
        console.log(taxista);
        var me=this,
            invocation = new XMLHttpRequest(),
            params = 'idTaxista=' + taxista[0].idTaxista +
                '&token='+localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Read?' + params;
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        console.log('ServletTaxista/Read');
                        console.log(r);
                        var latLng = latlng = new google.maps.LatLng(r.latitud, r.longitud); //Se crea la coordenada de la posicion actual;
                        me.markerTaxista.setPosition(latLng);
                    }
                }
            }
            invocation.send();
        }
    },

    addMarker: function(markerOpts) {
        var marker =  new google.maps.Marker(markerOpts);
        Ext.Object.each(markerOpts.listeners, function(name, fn){
            google.maps.event.addListener(marker, name, fn);
        });
        return marker;
    },

    actualizaPosicionCliente:function(position){
        console.log('client position');
        console.log(position);
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //Se crea la coordenada de la posicion actual

        this.markerCliente.setPosition(latlng);
        this.setAddressMarker(this.map, this.markerCliente, this.infowindow, this.markerCliente.getPosition());
        this.map.setCenter(latlng);
    },

    taxistaEnLugar:function(idServicio){
        var _this=this, data = [nombre='']
            invocation = new XMLHttpRequest(),
            params = 'idServicio=' + idServicio + '&estatusServicio=EN EL LUGAR&token='+localStorage.getItem('Logeado'),
            url = 'http://isystems.com.mx:8181/Trinus/ServletInfoServicio?' + params;
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        Ext.MessageBox.alert('Información', "¡Enhorabuena!, El taxi ha llegado.");
                        _this.runner.stop();
                        _this.datosTaxista(data);
                        _this.setPosicionActual(_this.actualizaPosicionCliente.bind(_this))
                    } else {
                        Ext.MessageBox.alert('Información', r.result);
                    }
                }
            }
            invocation.send();
        }
    },

    autoCompleteOnDestino:function(position){
        var _this=this,
            defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

        var input = document.getElementById('txtDestino-inputEl');

        var options = {
            bounds: defaultBounds
        };

        var autocomplete = new google.maps.places.Autocomplete(input, options);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var objLocation = autocomplete.getPlace();
            _this.destinoOnMap({latitud:objLocation.geometry.location.ib, longitud:objLocation.geometry.location.jb});
        });
    },

    destinoOnMap:function(response){
        var _this=this,
            latlng = new google.maps.LatLng(response.latitud, response.longitud), //Se crea la coordenada de la posicion actual
            infowindow = new google.maps.InfoWindow();

        var marker = this.addMarker({ //Se crea el marcador de la ubicacion actual
            draggable:true,
            position:latlng,
            map:this.map,
            animation:google.maps.Animation.DROP,
            listeners:{
                dragend:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    _this.setAddressMarker(_this.map, marker, infowindow, marker.getPosition(), true);
                },
                click:function () { //Agregamos el evento para cuando se termine de arrastrar el marcador.
                    infowindow.open(_this.map, marker);
                }
            }
        });

        this.setAddressMarker(this.map, marker, infowindow, latlng, true); //Agregamos la direccion al marcador

        this.calcularRuta(response);
    },

    calcularRuta:function (position) {
        var me = this;
        if(me.directionsDisplay){ //si ya hay otro destino, borrar la ruta
            me.directionsDisplay.setMap(null);
        }
        me.directionsService = new google.maps.DirectionsService();
        me.directionsDisplay = new google.maps.DirectionsRenderer();

        me.directionsDisplay.setMap(me.map);
        var request = {
            origin:new google.maps.LatLng(me.markerCliente.getPosition().lat(), me.markerCliente.getPosition().lng()),
            destination:new google.maps.LatLng(position.latitud, position.longitud),

            travelMode:google.maps.TravelMode["DRIVING"]
        };
        me.directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                me.directionsDisplay.setDirections(response);
            }
        });
    },

    recargaSaldo: function(){
        this.el.mask();
        this.window = Ext.create('Ext.window.Window', {
            title: 'Recarga de Credito',
            width: 400,
            height: 150,
            draggable: false,
            scope: this,
            items:[{
                xtype: 'containerrecarga'
            }],
            listeners:{
                scope: this,
                close: function(){
                    this.el.unmask();
                }
            }
        }).show();
    },

    datosTaxista:function(data){
        this.tplTaxista.tpl.overwrite(this.items.items[0].items.items[1].items.items[0].el,data);
    },

    deleteOverlays: function() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
}
});