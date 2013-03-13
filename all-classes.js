/*
Copyright(c) 2012 Codetlan
*/
/**
 * By Luis Enrique Mart&iacute;nez
 * Snake game
 * @autor LCC Luis Enrique Mart&iacute;nez G&oacute;mez<br>
 *        lumartineck@gmail.com<br>
 * @fecha Septiembre, 2012. M&eacute;xico DF
 */

/**
 * Set the configuration for the loader. This should be called right after ext-(debug).js
 * is included in the page, and before Ext.onReady.
 */
Ext.Loader.setConfig({
    enabled:true
});
/**
 * Loads Ext.app.Application class and starts it up with given configuration after the page is ready.
 */
Ext.application({
    /**
     * @cfg {String} name
     * The name of your application. This will also be the namespace for your views, controllers
     * models and stores. Don't use spaces or special characters in the name.
     */
    name:'Trinus',

    requires:['App.view.login.FormPanel', 'App.view.principal.Panel', 'App.view.admin.Panel'],

    defaults: {

    },
    /**
     * @method
     * @template
     * Called automatically when the page has completely loaded.
     */

    launch: function() {
        if(!localStorage.getItem("Logeado")){
            this.window = Ext.create('Ext.window.Window', {
                title: 'Bienvenido!!!',
                width: 310,
                height: 220,
                layout: 'fit',
                closable: false,
                draggable: false,
                items:[{
                    xtype: 'formpanellogin',
                    listeners: {
                        scope: this,
                        logeado: this.iniciar
                    }
                }]
            }).show();

        } else {
            this.iniciar();
        }
    },


    iniciar:function () {
        if (this.window) {
            this.window.destroy();
        }
        var usuario = Ext.decode(localStorage.getItem('Usuario')),
            panel = '',
            esSitio = false;
        //usuario.tipo = "3";
        switch (usuario.tipo) {
            case "0" :
                panel = 'panelprincipaladmin';
                break;
            case "1" :
                panel = 'panelprincipal';
                break;
            case "3" :
                panel = 'panelprincipaladmin';
                esSitio = true;
                break;
        }

        Ext.create('Ext.container.Viewport', {
            layout:'fit',
            items:[
                {
                    xtype:panel,
                    esSitio: esSitio
                }
            ]
        });
    }
});
Ext.define('App.view.login.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formpanellogin',
    requires:['App.view.registro.FormPanel'],

    bodyPadding: 10,
    buttonAlign: 'center',
    defaults:{
        xtype:'textfield',
        margin:5,
        allowBlank:false,
        //vtype:'alphanum',
        labelWidth: 110,
        style: {
            fontFamily: 'orbitron-medium'
        }
    },

    initComponent: function(){

        this.items = this.buildItems();
        this.buttons = this.buidlButtons();

        this.callParent(arguments);

    },

    buildItems:function () {
        var items = [
            {
                fieldLabel:'Movil',
                name:'txtMovil',
                value: '5555555555'
            },{
                fieldLabel:'Password',
                inputType:'password',
                name:'txtPass',
                value: 'trinus',
                listeners:{
                    scope:this,
                    specialkey:function(field,e){
                        if(e.getKey()==e.ENTER){
                            this.logeo();
                        }
                    }
                }
            }
        ];

        return items;
    },

    buidlButtons:function(){
        var buttons= [{
            text: 'Registrate',
            ui: 'inverse',
            scale: 'medium',
            iconCls: 'icon-user icon-white',
            scope: this,
            handler: this.windowRegistrarse
        }, {
            scope: this,
            text: 'Ingresa',
            ui: 'warning',
            scale: 'medium',
            iconCls: 'icon-ok icon-white',
            handler: this.logeo
        }];

        return buttons;
    },

    logeo:function(){
        var form = this.getForm(),
            obj = form.getValues();
        if(form.isValid()){
            var invocation=new XMLHttpRequest(),
                url = 'http://isystems.com.mx:8181/Trinus/ServletLogin?movil='+obj.txtMovil+'&password='+ obj.txtPass;
            if(invocation) {
                invocation.open('POST', url, true);
                invocation.onreadystatechange = this.logear.bind(this);
                invocation.send();
            }
        }
    },

    logear:function(response){
        if (response.target.readyState == 4 && response.target.status == 200) {
            var r = Ext.decode(response.target.responseText);
            if (r.result === "ok") {
                localStorage.setItem("Logeado", r.token);//Se guarda un identificador para no perder la session
                localStorage.setItem("Usuario", Ext.encode(r));
                this.fireEvent("logeado", r);
            } else {
                Ext.MessageBox.alert('Status', r.result);
            }
        }
    },

    windowRegistrarse:function(){
        this.fireEvent('mask');
        this.window = Ext.create('Ext.window.Window', {
            title: 'Ingresa tus Datos',
            width: 415,
            height: 336,
            draggable: false,
            layout: 'fit',
            items:[{
                xtype: 'formregistrarse',
                listeners:{
                    scope: this,
                    cerrarWindow: function(){
                        this.window.close();
                    }

                }
            }]
        }).show();
    }
});

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
                    var address = results[0].formatted_address;
                    map.setZoom(16);

                    infowindow.setContent(address);
                    infowindow.setOptions({maxWidth: 150});
                    infowindow.open(map, marker);
                    if(!sinAddressText){
                        _this.setAddressText(address);
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
            var objLocation = autocomplete.getPlace().geometry.location;
            _this.destinoOnMap({latitud:objLocation.lat(), longitud:objLocation.lng()});
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
Ext.define('App.view.admin.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelprincipaladmin',
    requires:['App.view.admin.MenuAdminPanel', 'App.view.admin.taxistas.Panel', 'App.view.admin.clientes.Panel',
        'App.view.admin.servicios.historial.Panel', 'App.view.xtemplate.XtemplateTaxista', 'App.view.admin.servicios.asignar.Panel'],

    layout:'border',
    esSitio: undefined,


    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var _this = this,
            opciones = [
                {
                    iconCls:"icon-user",
                    text:"Clientes",
                    scope:this,
                    cls:"Cliente"
                },
                {
                    iconCls:"icon-hand-right",
                    text:"Taxistas",
                    scope:this,
                    cls:"Taxi"
                },
                {
                    iconCls:'icon-list-alt',
                    text:'Historial de Servicios',
                    scope:this,
                    cls:'Historial'
                }
            ];

        if(this.esSitio){
            opciones.push({
                    iconCls:'icon-list-alt',
                    text:'Asignar Unidades',
                    scope:this,
                    cls:'Asignar'
                });
        }

        var items = [
            {
                descargas:[],
                xtype:"menuadmin",
                region:"west",
                title:"Menu",
                id:"Menu" + this.id,
                bbar:this.buildBbar(),
                flex:1,
                scope:this,
                opciones:opciones,
                listeners:{
                    opcion:function (titulo, panel) {
                        _this.agregarTabpanel(titulo, panel);
                    }
                }
            },
            {
                xtype:'tabpanel',
                itemId:"principalTabPanel",
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

    agregarTabpanel:function (titulo, panel) {
        var _this = this;
        if (this.items.items[0].descargas.indexOf(panel) == -1) {
            this.items.items[0].descargas.push(panel);
            this.items.items[1].add({
                xtype:"panel" + panel,
                flex:1,
                title:titulo,
                closable:true,
                scope:this,
                id:panel + this.id,
                esSitio:this.esSitio,
                listeners:{
                    maskara:function () {
                        _this.body.mask('Cargando...');
                    },
                    unmaskara:function () {
                        _this.body.unmask();
                    },
                    destroy:function () {
                        _this.items.items[0].descargas.splice(_this.items.items[0].descargas.indexOf(panel), 1);
                    }
                }});
            this.items.items[1].setActiveTab(panel + this.id);
        } else {
            this.items.items[1].setActiveTab(panel + this.id);
        }
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
            zoom:8,
            center:new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            mapTypeId:google.maps.MapTypeId.ROADMAP
        }; //Se crea la coordenada de la posicion actual
        this.infowindow = new google.maps.InfoWindow(); //Globo del marker con información
        this.arrTaxisMarkers = [];

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions); //Se crea el mapa

        var runner = new Ext.util.TaskRunner();

        runner.start({
            run:this.pedirTaxistas.bind(this),
            interval:1000000
        });

        if(this.esSitio){
            runner.start({
                run:this.pedirServciosSitio.bind(this),
                interval:1000000
            });
        }
    },

    addMarker:function (markerOpts) {
        var marker = new google.maps.Marker(markerOpts);
        Ext.Object.each(markerOpts.listeners, function (name, fn) {
            google.maps.event.addListener(marker, name, fn);
        });
        return marker;
    },

    pedirTaxistas:function () {
        var params = 'token=' + localStorage.getItem('Logeado');
        if(this.esSitio){
            params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio
        }
        Ext.data.JsonP.request({
            url:'http://isystems.com.mx:8181/Trinus/ServletTaxistas?' + params,
            scope:this,
            success:this.addTaxistasOnMap,
            failure:function(r){
                Ext.MessageBox.alert('Información', r.result);
            }
        });
    },

    addTaxistasOnMap:function (response) {
        var _this = this;
        _this.tplTaxista = Ext.create('App.view.xtemplate.XtemplateTaxista', {
            data:{
                nombre:''
            }});
        Ext.each(response.data, function (taxista) {
            if (taxista.latitud !== "") {
                var latlng = new google.maps.LatLng(taxista.latitud, taxista.longitud); //Se crea la coordenada de la posicion actual,
                if (Ext.isEmpty(_this.arrTaxisMarkers[taxista.idTaxista])) {

                    var marker = _this.addMarker({
                        position:latlng,
                        map:_this.map,
                        draggable:false,
                        animation:google.maps.Animation.DROP,
                        icon: 'images/trinus.png',
                        listeners:{
                            click:function () {
                                var infowindow = new google.maps.InfoWindow({
                                    content:_this.template(taxista)
                                });
                                infowindow.open(_this.map, marker);
                            }
                        }
                    });
                    _this.arrTaxisMarkers[taxista.idTaxista] = marker;
                } else {
                    _this.arrTaxisMarkers[taxista.idTaxista].setPosition(latlng);
                }
                _this.map.getBounds().extend(latlng);
                //_this.map.setCenter(_this.map.getBounds().getCenter());
            }
        });
        //_this.map.setCenter(_this.map.getBounds().getCenter());
        //_this.map.fitBounds(_this.map.getBounds());
        //_this.map.panToBounds(_this.map.getBounds());
    },

    template:function (t) {
        var tem = '<div class="media">' +
            '<div style="text-align: center;">' +
            '<h4 class="media-heading">Detalles del Taxista</h4>' +
            '</div>' +
            '<img height="140" style="border: 2px solid #99BBE8; width:100px; float: left;" class="media-object" src="images/man.png">' +
            '<div style="padding-left: 115px;">Nombre:<br><font color="#999";>' + t.nombreCompleto + '</font><br>' +
            'No. del Taxi:<br><font color="#999">' + t.unidad + '</font><br>' +
            'Placas:<br><font color="#999" >' + t.placas + '</font></div>' +
            '</div>' +
            '</div>';
        return tem;
    },

    pedirServciosSitio:function(){
        var params = '?token=' + localStorage.getItem('Logeado') + '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
        Ext.data.JsonP.request({
            url:'http://isystems.com.mx:8181/Trinus/ServletServicios' + params,
            scope:this,
            success:this.addNewServicios,
            failure:function(response){
                Ext.MessageBox.alert('Información', response.result);
            }
        });
    },

    addNewServicios:function(response){
        var me = this;
        Ext.each(response.data, function (servicio) {
            if(servicio.estatus == "SIN UNIDAD"){
                me.agregarTabpanel("Asignar Unidades", "Asignar");
                var store = Ext.getStore('storeAsignar'),
                    indexOfRecord = store.indexOf(servicio);

                if(indexOfRecord == -1){
                    store.add(servicio);
                }
            }
        });
    }
});
Ext.define('App.view.registro.FormPanel', {
    extend: 'Ext.form.Panel',
    alias :'widget.formregistrarse',

    bodyPadding: 3,
    buttonAlign: 'center',
    defaults:{
        xtype:'textfield',
        labelWidth: 150,
        allowBlank:false,
        vtype:'alphanum',
        margin: 10,
        style: {
            fontFamily: 'orbitron-medium'
        },
        width: 380
    },

    initComponent: function(){
        this.items = this.buildItems();
        this.buttons = this.buidlButtons();
        this.aplicarVtypes();

        this.callParent(arguments);
    },

    buildItems:function () {


        var items = [
            {
                fieldLabel:'Nombre Completo',
                name:'txtName',
                vtype:'nombre'
            },{
                fieldLabel:'Movil',
                name:'txtMovil',
                vtype:'num',
                maxLength: 10
            },{
                fieldLabel:'Contraseña',
                inputType:'password',
                id:'contrasena'+this.id,
                name:'txtPass'
            },{
                fieldLabel:'Confirmaci&oacute;n',
                inputType:'password',
                name:'txtConf'
            },{
                fieldLabel:'Email',
                name:'txtEmail',
                vtype:'email'
            }
        ];

        return items;
    },

    buidlButtons:function(){
        var _this=this,
            buttons= [{
            text: 'Cancelar',
            ui: 'inverse',
            scale: 'medium',
            iconCls: 'icon-remove icon-white',
            scope: this,
            handler: function(){
                this.fireEvent("cerrarWindow");
            }

        }, {
            scope: this,
            text: 'Crear',
            ui: 'warning',
            iconCls: 'icon-ok icon-white',
            scale: 'medium',
            handler:function(){
                if(this.form.isValid()){
                    var valores = this.form.getValues();
                    if(valores.txtPass === valores.txtConf){
                        _this.registrar(valores);
                    } else {
                        Ext.getCmp('contrasena'+_this.id).markInvalid("Las contraseñas no coinciden.");
                    }
                }
            }
        }];

        return buttons;
    },

    registrar:function(values){
        var _this=this,
            invocation = new XMLHttpRequest(),
            params = 'nombre_completo=' + values.txtName + '&movil=' + values.txtMovil + '&contrasena=' + values.txtPass + '&email=' + values.txtEmail,
            url = 'http://isystems.com.mx:8181/Trinus/ServletCreateClienteMovil?' + params;
        if (invocation) {
            invocation.open('POST', url, true);
            invocation.onreadystatechange = function (response) {
                if (response.target.readyState == 4 && response.target.status == 200) {
                    var r = Ext.decode(response.target.responseText);
                    if (r.result === "ok") {
                        Ext.MessageBox.alert('Información', "¡Enhorabuena "+ values.txtName + "!, Ahora puedes ingresar al sistema.", _this.fireEvent("cerrarWindow"));
                    } else {
                        Ext.MessageBox.alert('Información', r.result);
                    }
                }
            }
            invocation.send();
        }
    },

    aplicarVtypes:function(){
        Ext.apply(Ext.form.field.VTypes, {
            //  vtype validation function
            nombreMask:/^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/,
            nombreText:'Nombre no v&aacute;lido',
            nombre:function(val,field){
                var regExp=/^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/;
                ///^[a-zA-Z ][-_.a-zA-Z0-9 ]{0,30}$/;
                return regExp.test(val);
            },
            numMask:/[\d\$.]/,
            num:function(val,field){
                return val;
            }
        });
    }
});

/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.menu.MenuPanel', {
    extend:'Ext.container.Container',
    alias:'widget.menupanel',
    requires:['App.view.xtemplate.XtemplateTitulo', 'App.view.menu.FormPanel'],

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                flex: 2,
                layout:'fit',
                xtype:'xtemplatetitulo'
            },
            {

                flex: 6,
                xtype:'formpanel',
                layout:{
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'start'
                },
                listeners:{
                    scope:this,
                    pedirtaxi:function(formValues){
                        this.fireEvent('pedirtaxi',formValues);
                    }
                }
            }
        ];

        return items;
    },

    setAddressText:function (address) {
        this.items.items[1].items.items[0].setValue(address);
    }
});


Ext.define('App.view.xtemplate.XtemplateTaxista', {
    extend:'Ext.DataView',
    alias:'widget.xtemplatetaxista',

    style:{
        fontFamily:'orbitron-light',
        paddingTop:'20px',
        paddingLeft: '20px',
        lineHeight: '25px'
    },


    initComponent:function () {
        this.tpl = this.tplTaxista();

        this.callParent(arguments);
    },

    tplTaxista:function () {
        var  template = new Ext.XTemplate('<tpl for=".">'+
            '<tpl if="nombre">'+
            '<div class="media">'+
            '<div style="text-align: center;">'+
                '<h3 class="media-heading">Detalles del Taxista</h3>'+
            '</div>' +
            '<img height="140" style="border: 2px solid #99BBE8; width:100px; float: left;" class="media-object" src="images/man.png">'+
            '<div style="padding-left: 115px;">Nombre:<br><font color="#999";> {nombre}</font><br>' +
            'No. del Taxi:<br><font color="#999"> {unidad}</font><br>' +
            'Placas:<br><font color="#999" > {placas}</font></div>' +
            '</div>'+
            '<tpl else>'+
            '<div class="media">'+
            '<div style="text-align: center;">'+
            '<h3 class="media-heading">Detalles del Taxista</h3><br>'+
            '<img id="detail-icon-img" src="http://cdn1.iconfinder.com/data/icons/customicondesignoffice2/128/FAQ.png" alt="answer, confusion, faq, question icon">'+
            '</div>' +
            '</div>' +
            '</tpl>'+
            '</tpl>');

        return template;


    }




});

/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.recarga.FormPanel', {
    extend:'Ext.container.Container',
    alias:'widget.containerrecarga',

    padding:'10 0 0 20',

    initComponent:function () {
        this.html = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [ '<form action="https://www.paypal.com/cgi-bin/webscr" method="post">' +
            '<input type="hidden" name="cmd" value="_s-xclick">' +
            '<table>' +
            '<tr><td><input type="hidden" name="on0" value="Trinus"></td>' +
            '<td><select name="os0">' +
            '<option value="Recarga 1">Recarga 1 $5.00 MXN</option>' +
            '<option value="Recarga 2">Recarga 2 $30.00 MXN</option>' +
            '<option value="Recarga 3">Recarga 3 $50.00 MXN</option>' +
            '<option value="Recarga 4">Recarga 4 $200.00 MXN</option>' +
            '</select></td>' +
            '<td><input type="hidden" name="currency_code" value="MXN">' +
            '<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIIGQYJKoZIhvcNAQcEoIIICjCCCAYCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYANnFEGIL2wQAdmM4DNSpZqK9JOaX/cEEJwbvMqGktXuoSQd0OoEOdK9/WErswDerHoiUa/HFs8pgIublAMTbsqO4S6Iq3QJUMxwHizUN287vokxaN1ANjezA4BXLeYIhxmrFEKLAZqKq5PWl4YnD5FAeRJTDX4MFNt/tzsKh9D/TELMAkGBSsOAwIaBQAwggGVBgkqhkiG9w0BBwEwFAYIKoZIhvcNAwcECJ4lFPV8LDJCgIIBcCNPoeFZl7cCLuFozc7GPnMAfwqIToCxtNnUQlshv26+Z51aDHiL73S/3z4vaJz6P1BAe/mcsOLOTpqB/YNouxSIx9W0ZmrXLlrymwwWnXXp9O2Ps28figybmAZXUNCIhdjvF/egVM1d50Yw6EyYwAvQe5Xq7md9kmMakgFHWHrUjEB9cpQsRsQnqgKoNyPJjBehEaZfaLashxoizJKO8EgtMEbd+8Rgj4jmlsU1FnHZ8GgkBa3hSIqZGO3zBrRJMXoMZE0Q0mqPdfhOR7gpcMnoVl5+xPB2pxVp8wt8xMKdNEFiC8Ruxplz27Kp+xUVCRVh3KLzDD+XkBrst5GWR9ZjT44o/oqRl3SpiwPkn3Uj2R9l/Z1oIMDV5PQxo34ywww8JjWxvJR9GMQUX2GpFb46crt0h9oYwya6zpnfFz5OfVRFtJK8ctZC7OaOf9OnoMadGKOe+z+e8xjNYHdIWoznbZaDz33xwEGkCLnH3m02oIIDhzCCA4MwggLsoAMCAQICAQAwDQYJKoZIhvcNAQEFBQAwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMB4XDTA0MDIxMzEwMTMxNVoXDTM1MDIxMzEwMTMxNVowgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBR07d/ETMS1ycjtkpkvjXZe9k+6CieLuLsPumsJ7QC1odNz3sJiCbs2wC0nLE0uLGaEtXynIgRqIddYCHx88pb5HTXv4SZeuv0Rqq4+axW9PLAAATU8w04qqjaSXgbGLP3NmohqM6bV9kZZwZLR/klDaQGo1u9uDb9lr4Yn+rBQIDAQABo4HuMIHrMB0GA1UdDgQWBBSWn3y7xm8XvVk/UtcKG+wQ1mSUazCBuwYDVR0jBIGzMIGwgBSWn3y7xm8XvVk/UtcKG+wQ1mSUa6GBlKSBkTCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb22CAQAwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQCBXzpWmoBa5e9fo6ujionW1hUhPkOBakTr3YCDjbYfvJEiv/2P+IobhOGJr85+XHhN0v4gUkEDI8r2/rNk1m0GA8HKddvTjyGw/XqXa+LSTlDYkqI8OwR8GEYj4efEtcRpRYBxV8KxAW93YDWzFGvruKnnLbDAF6VR5w/cCMn5hzGCAZowggGWAgEBMIGUMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMTMwMjA1MjAwNzEwWjAjBgkqhkiG9w0BCQQxFgQUb8rJOKuHPcox7JM3RLWUjTZU6zcwDQYJKoZIhvcNAQEBBQAEgYCPqxT2oRdmGdsbRbiX5TZafn8P5/ra/LYPIFEoV6AEeBruQuk372bCTO4RDRQYNBCblD0bX1hwkzlq7Zs24Icon5i/ksHr9gfZTiUyU3cD7P4Gt3z2KAKcrdCws0w2vtpxpFEuoY30Y6wCzdyg/ZwQEYo+8x/dkO9eo30EoCVUEA==-----END PKCS7-----">' +
            '<input type="image" style="margin-top: 25px; margin-left: 10px;"  src="https://www.paypalobjects.com/es_XC/MX/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal, la forma más segura y rápida de pagar en línea.">' +
            '<img alt="" border="0" src="https://www.paypalobjects.com/es_XC/i/scr/pixel.gif" width="1" height="1"></td>' +
            '</table>' +
            '</form>' ]
    }
});



Ext.define('App.view.admin.MenuAdminPanel', {
    extend:'Ext.panel.Panel',
    alias:'widget.menuadmin',

    frame:true,
    opciones:null,


    initComponent:function () {
        var _u = Ext.BLANK_IMAGE_URL;

        var _menu = '<ul id="task-views">';
        Ext.each(this.opciones, function (item) {
            item.id = Ext.id();
            _menu += '<li>' +
                '		<img style="width:20px;" src="' + _u + '" class="' + item.iconCls + '"/>' +
                '		<a id="' + item.id + '" class="' + item.cls + '" href="#">' + item.text + '</a>' +
                '</li>';
        }, this);
        _menu += '</ul>';
        Ext.apply(this, {
            html:_menu
        });

        this.callParent(arguments);
        this.on("afterrender", this.onafterRender);
    },

    onafterRender:function () {
        var _this = this;
        this.body.on('click', function (e,t) {
            Ext.each(_this.opciones, function (item) {
                if(e.getTarget('a.'+item.cls)){
                    _this.titulo = item.text;
                    _this.panel = item.cls;
                }
            }, _this);

            if(this.titulo){
                this.fireEvent("opcion", this.titulo,this.panel);
            }
        }, this);
    }
});

Ext.define('App.view.admin.taxistas.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelTaxi',
    requires:['App.view.admin.taxistas.GridPanel'],

    layout:'border',
    esSitio:undefined,

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [{
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
        }];
    }
});

Ext.define('App.view.admin.clientes.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelCliente',
    requires:['App.view.admin.clientes.GridPanel'],

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
            xtype:'gridpanelfilterC',
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
    }
});


Ext.define('App.view.admin.servicios.historial.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelHistorial',
    requires:['App.view.admin.servicios.historial.GridPanel'],

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
            xtype:'gridpanelfilterH',
            region:'center',
            esSitio:this.esSitio
        }
    }
});

/**
 * Created with JetBrains PhpStorm.
 * User: lumartin
 * Date: 06/03/13
 * Time: 17:22
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.admin.servicios.asignar.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.panelAsignar',
    requires:['App.view.admin.servicios.asignar.GridPanel'],

    layout:'border',
    esSitio:undefined,

    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        return [{
            xtype:'gridpanelAsignar',
            region:'center',
            esSitio:this.esSitio
        }];
    }
});

Ext.define('App.view.xtemplate.XtemplateTitulo', {
    extend:'Ext.DataView',
    alias:'widget.xtemplatetitulo',

    emptyText: 'No hay taxistas disponibles',
    tpl: '',
    style:{
        backgroundColor: '#333',
        lineHeight: '90px',
        fontSize:  '80pt',
        fontFamily: 'orbitron-medium',
        textAlign: 'center',
        paddingTop: '20px'
    },

    initComponent: function(){
        this.tpl = this.tplTaxista();

        this.callParent(arguments);
    },

    tplTaxista: function(){
         return '<font color="FFC332">Trinus</font>';
    }




});

/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.menu.FormPanel', {
    extend:'Ext.form.FormPanel',
    alias:'widget.formpanel',

    bodyPadding: 10,

    defaults:{
        labelAlign: 'top',
        paddingTop: 30,
        style: {
            fontFamily: 'orbitron-medium'
        }
    },


    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                xtype:'textfield',
                fieldLabel:'Ubicaci&oacute;n',
                name:'txtOrigen',
                emptyText: 'Ubicación'
            },{
                xtype:'textfield',
                fieldLabel:'Destino',
                id:'txtDestino',
                name:'txtDestino',
                emptyText:'No Obligatorio'
            },
            {
                xtype:'textarea',
                fieldLabel:'Observaciones',
                name:'txtObservaciones',
                emptyText:'No Obligatorio'
            },
            {
                xtype:'button',
                text:'Pedir Taxi',
                icon: 'images/icon-1.png',
                flex: 2,
                scope:this,
                ui:'warning',
                scale:'large',
                handler:function(){
                    this.fireEvent('pedirtaxi', this.form.getValues());
                }
            }
        ];

        return items;
    },

    setAddressText:function (address) {
        this.items.items[1].items.items[0].setValue(address);
    }
});



Ext.define('App.view.admin.taxistas.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelfilterT',

    esSitio:undefined,
    resumida: false,

    viewConfig:{
        forceFit:true,
        showPreview:true, // custom property
        enableRowBody:true,
        getRowClass:function (r, i, rp, d) {
            if (r.data.estatus == 'INACTIVO') {
                rp.body = '<p>' + r.data.estatus + 'didier</p>'
                return 'redUnder';
            }
        }
    },

    initComponent:function () {
        Ext.define('Taxi', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.plugins = this.buildPlugins();
        this.dockedItems = this.buildDockedItems();
        //this.bbar = this.buildBbar();

        this.callParent(arguments);

        this.getSelectionModel().on('selectionchange', function (selModel, selections) {
            this.down('#delete').setDisabled(selections.length === 0);
        }, this);
    },

    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input
    afterRender:function () {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        //me.statusBar = me.down('statusbar[name=searchStatusBar]');
    },

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
        var params = '?token=' + localStorage.getItem('Logeado');

        if(this.esSitio){
            params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
        }

        var store = new Ext.data.Store({
            model:'Taxi',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletTaxistas'+params,
                reader:{
                    type:'json',
                    root:'data'
                },
                writer:{
                    type:'json'
                }
            }),
            //autoSync: true,
            autoLoad:true,
            listeners:{
                scope:this,
                update:function (store, record, operation, eOpts) {
                    var _this = this, record = record.data,
                        invocation = new XMLHttpRequest(), url,
                        params = '?nombre=' + record.nombreCompleto + '&contrasena=' + record.contrasena + '&direccion=' + record.direccion +
                            '&telCasa=' + record.movil + '&movil=' + record.movil + '&email=' + record.email + '&' +
                            'fechaNac=2013/02/11&imei=' + record.imei + '&unidad=' + record.unidad + '&placas=' + record.placas;

                    if(this.esSitio){
                        params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                    }
                    if (record.idTaxista == '') {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Create' + params + '&token=' + localStorage.getItem('Logeado');
                        if (invocation) {
                            invocation.open('POST', url, true);
                            invocation.onreadystatechange = function (response) {
                                if (response.target.readyState == 4 && response.target.status == 200) {
                                    var r = Ext.decode(response.target.responseText);
                                    if (r.result === "ok") {
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                        //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                    } else {
                                        Ext.MessageBox.alert('Información', r.result);
                                    }
                                }
                            }
                            invocation.send();
                        }
                    } else {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Update' + params + '&idTaxista=' +
                            record.idTaxista + '&token=' + localStorage.getItem('Logeado');
                        if (invocation) {
                            invocation.open('POST', url, true);
                            invocation.onreadystatechange = function (response) {
                                if (response.target.readyState == 4 && response.target.status == 200) {
                                    var r = Ext.decode(response.target.responseText);
                                    if (r.result === "ok") {
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                        //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                    } else {
                                        Ext.MessageBox.alert('Información', r.result);
                                    }
                                }
                            }
                            invocation.send();
                        }
                    }
                }
            }
        });

        return store;
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre', flex:1, sortable:true, dataIndex:'nombreCompleto', editor:{vtype:'nombre', allowBlank:false}},
            {text:'Dirección', flex:1, sortable:true, dataIndex:'direccion', editor:{vtype:'nombre', allowBlank:false}, hidden: this.resumida},
            {text:'Movil', flex:1, sortable:true, dataIndex:'movil', editor:{vtype:'num', allowBlank:false}},
            {text:'Email', flex:1, sortable:true, dataIndex:'email', editor:{vtype:'email', allowBlank:false}, hidden: this.resumida},
            {text:'Imei', flex:1, sortable:true, dataIndex:'imei', editor:{vtype:'num', allowBlank:false},hidden: this.resumida},
            {text:'Unidad', flex:1, sortable:true, dataIndex:'unidad', editor:{vtype:'alphanum', allowBlank:false}},
            {text:'Placas', flex:1, sortable:true, dataIndex:'placas', editor:{vtype:'alphanum', allowBlank:false}},
            {text:'Contraseña', flex:1, sortable:true, dataIndex:'contrasena', editor:{vtype:'alphanum', allowBlank:false}, hidden: this.resumida},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus'}
        ];

        return cols;
    },

    buildPlugins:function () {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
        return [rowEditing];

    },

    buildDockedItems:function () {
        var me = this;
        return [
            {
                xtype:'toolbar',
                dock:'top',
                items:[
                    {
                        text:'Agregar',
                        ui:'success',
                        iconCls:'icon-plus icon-white',
                        hidden: me.esSitio,
                        handler:function () {
                            // empty record
                            me.store.insert(0, new Taxi());
                            me.plugins[0].startEdit(0, 0);
                        }
                    },
                    '-',
                    {
                        itemId:'delete',
                        text:'Desactivar',
                        ui:'danger',
                        iconCls:'icon-remove icon-white',
                        hidden: me.esSitio,
                        disabled:true,
                        handler:function () {
                            var selection = me.getView().getSelectionModel().getSelection()[0];
                            if (selection) {
                                var record = selection.data,
                                    invocation = new XMLHttpRequest(),
                                    params = '?idTaxista=' + record.idTaxista + '&token=' + localStorage.getItem('Logeado');

                                if(this.esSitio){
                                    params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                                }

                                me.fireEvent("mask");
                                if (record.idTaxista != '') {
                                    if (invocation) {
                                        invocation.open('POST', 'http://isystems.com.mx:8181/Trinus/ServletTaxista/Delete'+params, true);
                                        invocation.onreadystatechange = function (response) {
                                            if (response.target.readyState == 4 && response.target.status == 200) {
                                                var r = Ext.decode(response.target.responseText);
                                                if (r.result === "ok") {
                                                    me.store.load();
                                                    me.fireEvent("unmask");
                                                    //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                                } else {
                                                    Ext.MessageBox.alert('Información', r.result);
                                                }
                                            }
                                        }
                                        invocation.send();
                                    }
                                }
                                me.store.remove(selection);
                                me.store.load();
                                me.fireEvent("unmask");
                            }
                        }
                    },
                    '-',
                    {
                        text: 'Actualizar',
                        ui: 'inverse',
                        iconCls: 'icon-refresh icon-white',
                        hidden: me.esSitio,
                        handler: function(){
                            me.fireEvent("mask");
                            me.store.load();
                            me.fireEvent("unmask");
                        }
                    },
                    '->',
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Buscar',
                        listeners:{
                            scope:this,
                            change:this.spotLight
                        }
                    }
                ]
            }
        ];
    },

    buildBbar:function () {
        var me = this, bBar, nombreC, direccion, movil, email, imei, unidad, placas, bReset;

        nombreC = me.buildTextField('nombreCompleto', 'nombre');
        direccion = me.buildTextField('direccion', 'nombre');
        movil = me.buildTextField('movil', 'num');
        email = me.buildTextField('email', 'email');
        imei = me.buildTextField('imei', 'num');
        unidad = me.buildTextField('unidad', 'alphanum');
        placas = me.buildTextField('placas', 'alphanum');
        bReset = Ext.create('Ext.Button', {text:'Limpiar', ui:'info', flex:1, iconCls:'icon-refresh icon-white', scope:this, handler:me.resetSearchs});

        bBar = [nombreC, direccion, movil, email, imei, unidad, placas, bReset];

        return bBar;
    },

    buildTextField:function (dataIndex, vtype) {
        var me = this,
            textField = {
                xtype:'textfield',
                id:dataIndex + me.id,
                flex:1,
                vtype:vtype,
                emptyText:dataIndex,
                listeners:{
                    scope:this,
                    change:me.filterStore
                }
            };

        return textField;
    },

    filterStore:function () {
        var me = this, i, value, textfields = ['nombreCompleto', 'direccion', 'movil', 'email', 'imei', 'unidad', 'placas'];
        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            value = Ext.getCmp(textfields[i] + me.id).getValue();
            if (!Ext.isEmpty(value)) {
                me.store.filter(textfields[i], value, true, false)
            }

        }

    },

    buildFields:function () { // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name:'idTaxista', type:'string'},
            {name:'nombreCompleto', type:'string'},
            {name:'direccion', type:'string'},
            {name:'movil', type:'string'},
            {name:'email', type:'string'},
            {name:'imei', type:'string'},
            {name:'unidad', type:'string'},
            {name:'placas', type:'string'},
            {name:'contrasena', type:'string'},
            {name:'estatus', type:'string'}
        ];

        return fields;
    },


    resetSearchs:function () {
        var me = this, i, textfields = ['nombreCompleto', 'direccion', 'movil', 'email', 'imei', 'unidad', 'placas'];

        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            Ext.getCmp(textfields[i] + me.id).reset();
        }
    },

    spotLight:function (t, newValue, oldValue, e) {
        var me = this;

        me.store.clearFilter(true);

        me.store.filterBy(function(record){
            if(record.get('nombreCompleto').search(newValue)  != -1 || record.get('movil').search(newValue) != -1
                || record.get('email').search(newValue) != -1 || record.get('contrasena').search(newValue) != -1
                || record.get('direccion').search(newValue) != -1 || record.get('unidad').search(newValue) != -1
                || record.get('imei').search(newValue) != -1 || record.get('placas').search(newValue) != -1){
                return true;
            }
        },this);
    }


});

Ext.define('App.view.admin.clientes.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelfilterC',

    esSitio:undefined,

    viewConfig:{
        forceFit:true,
        showPreview:true, // custom property
        enableRowBody:true,
        getRowClass:function (r, i, rp, d) {
            if (r.data.estatus == 'INACTIVO') {
                rp.body = '<p>' + r.data.estatus + 'didier</p>'
                return 'redUnder';
            }
        }
    },

    initComponent:function () {
        Ext.define('Cliente', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.plugins = this.buildPlugins();
        this.dockedItems = this.buildDockedItems();
        //this.bbar = this.buildBbar();

        this.callParent(arguments);

        this.getSelectionModel().on('selectionchange', function (selModel, selections) {
            this.down('#delete').setDisabled(selections.length === 0);
        }, this);
    },

    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input
    afterRender:function () {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        //me.statusBar = me.down('statusbar[name=searchStatusBar]');
    },

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
        var params = '?token=' + localStorage.getItem('Logeado');
        if (this.esSitio) {
            params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitito;
        }
        var store = new Ext.data.Store({
            model:'Cliente',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletClientes' + params,
                reader:{
                    type:'json',
                    root:'data'
                },
                writer:{
                    type:'json'
                }
            }),
            autoLoad:true,
            listeners:{
                scope:this,
                update:function (store, record, operation, eOpts) {
                    var _this = this, record = record.data,
                        invocation = new XMLHttpRequest(), url,
                        params = 'nombre=' + record.nombreCompleto + '&contrasena=' + record.contrasena +
                            '&movil=' + record.movil + '&email=' + record.email;

                    if (this.esSitio) {
                        params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                    }

                    if (record.idCliente == '') {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletCliente/Create?' + params + '&token=' + localStorage.getItem('Logeado');
                        if (invocation) {
                            invocation.open('POST', url, true);
                            invocation.onreadystatechange = function (response) {
                                if (response.target.readyState == 4 && response.target.status == 200) {
                                    var r = Ext.decode(response.target.responseText);
                                    if (r.result === "ok") {
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                        //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                    } else {
                                        Ext.MessageBox.alert('Información', r.result);
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                    }
                                }
                            }
                            invocation.send();
                        }
                    } else {
                        _this.fireEvent("mask");
                        url = 'http://isystems.com.mx:8181/Trinus/ServletCliente/Update?' + params + '&idCliente=' +
                            record.idCliente + '&token=' + localStorage.getItem('Logeado');
                        if (invocation) {
                            invocation.open('POST', url, true);
                            invocation.onreadystatechange = function (response) {
                                if (response.target.readyState == 4 && response.target.status == 200) {
                                    var r = Ext.decode(response.target.responseText);
                                    if (r.result === "ok") {
                                        _this.store.load();
                                        _this.fireEvent("unmask");
                                        //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                    } else {
                                        Ext.MessageBox.alert('Información', r.result);
                                    }
                                }
                            }
                            invocation.send();
                        }
                    }
                }
            }
        });

        return store;
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre', flex:1, sortable:true, dataIndex:'nombreCompleto', editor:{vtype:'nombre', allowBlank:false}},
            {text:'Movil', flex:1, sortable:true, dataIndex:'movil', editor:{vtype:'num', allowBlank:false}},
            {text:'Email', flex:1, sortable:true, dataIndex:'email', editor:{vtype:'email', allowBlank:false}},
            {text:'Contraseña', flex:1, sortable:true, dataIndex:'contrasena', editor:{vtype:'alphanum', allowBlank:false}},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus' }
        ];

        return cols;
    },

    buildPlugins:function () {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
        return [rowEditing];

    },

    buildDockedItems:function () {
        var me = this;
        return [
            {
                xtype:'toolbar',
                dock:'top',
                items:[
                    {
                        text:'Agregar',
                        ui:'success',
                        //iconCls: 'icon-plus icon-white',
                        handler:function () {
                            // empty record
                            me.store.insert(0, new Cliente());
                            me.plugins[0].startEdit(0, 0);
                        }
                    },
                    '-',
                    {
                        itemId:'delete',
                        text:'Desactivar',
                        ui:'danger',
                        //iconCls: 'icon-remove icon-white',
                        disabled:true,
                        handler:function () {
                            var selection = me.getView().getSelectionModel().getSelection()[0];
                            if (selection) {
                                var record = selection.data,
                                    invocation = new XMLHttpRequest(),
                                    params = '?idCliente=' + record.idCliente + '&token=' + localStorage.getItem('Logeado');

                                if (this.esSitio) {
                                    params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
                                }

                                me.fireEvent("mask");
                                if (record.idCliente != '') {
                                    if (invocation) {
                                        invocation.open('POST', 'http://isystems.com.mx:8181/Trinus/ServletCliente/Delete' + params, true);
                                        invocation.onreadystatechange = function (response) {
                                            if (response.target.readyState == 4 && response.target.status == 200) {
                                                var r = Ext.decode(response.target.responseText);
                                                if (r.result === "ok") {
                                                    me.store.load();
                                                    me.fireEvent("unmask");
                                                    //Ext.MessageBox.alert('Información', "Se agrego el taxista correctamente");
                                                } else {
                                                    Ext.MessageBox.alert('Información', r.result);
                                                }
                                            }
                                        }
                                        invocation.send();
                                    }
                                }
                                me.store.remove(selection);
                                me.store.load();
                                me.fireEvent("unmask");
                            }
                        }
                    },
                    '-',
                    {
                        text:'Actualizar',
                        ui:'inverse',
                        iconCls:'icon-refresh icon-white',
                        handler:function () {
                            me.fireEvent("mask");
                            me.store.load();
                            me.fireEvent("unmask");
                        }
                    },
                    '->',
                    {
                        xtype:'textfield',
                        fieldLabel:'Buscar',
                        listeners:{
                            scope:this,
                            change:this.spotLight
                        }
                    }
                ]
            }
        ];
    },

    buildBbar:function () {
        var me = this, bBar, nombreC, movil, email, bReset;

        nombreC = me.buildTextField('nombreCompleto', 'nombre');
        movil = me.buildTextField('movil', 'num');
        email = me.buildTextField('email', 'email');
        bReset = Ext.create('Ext.Button', {text:'Limpiar', ui:'info', flex:1, scope:this, handler:me.resetSearchs});

        bBar = [nombreC, movil, email, bReset];

        return bBar;
    },

    buildTextField:function (dataIndex, vtype) {
        var me = this,
            textField = {
                xtype:'textfield',
                id:dataIndex + me.id,
                flex:1,
                vtype:vtype,
                emptyText:dataIndex,
                listeners:{
                    scope:this,
                    change:me.filterStore
                }
            };

        return textField;
    },

    filterStore:function () {
        var me = this, i, value, textfields = ['nombreCompleto', 'movil', 'email'];
        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            value = Ext.getCmp(textfields[i] + me.id).getValue();
            if (!Ext.isEmpty(value)) {
                me.store.filter(textfields[i], value, true, false)
            }

        }

    },

    buildFields:function () { // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name:'idCliente', type:'string'},
            {name:'nombreCompleto', type:'string'},
            {name:'movil', type:'string'},
            {name:'email', type:'string'},
            {name:'contrasena', type:'string'},
            {name:'estatus', type:'string'}
        ];

        return fields;
    },

    resetSearchs:function () {
        var me = this, i, textfields = ['nombreCompleto', 'movil', 'email'];

        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            Ext.getCmp(textfields[i] + me.id).reset();
        }
    },

    spotLight:function (t, newValue, oldValue, e) {
        var me = this;

        me.store.clearFilter(true);

        me.store.filterBy(function(record){
            if(record.get('nombreCompleto').search(newValue)  != -1 || record.get('movil').search(newValue) != -1
                || record.get('email').search(newValue) != -1 || record.get('contrasena').search(newValue) != -1
                || record.get('estatus').search(newValue) != -1){
                return true;
            }
        },this);
    }
});


Ext.define('App.view.admin.servicios.historial.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelfilterH',

    esSitio:undefined,

    initComponent:function () {
        var me = this;

        Ext.define('Historial', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();
        this.bbar = this.buildBbar();

        this.callParent(arguments);
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre Cliente', flex:1, sortable:true, dataIndex:'nombreCliente'},
            {text:'Nombre Taxista', flex:1, sortable:true, dataIndex:'nombreTaxista'},
            {text:'Dirección', flex:1, sortable:true, dataIndex:'direccion'},
            {text:'Unidad', flex:1, sortable:true, dataIndex:'unidad'},
            {text:'Placas', flex:1, sortable:true, dataIndex:'placas'},
            {text:'Fecha', flex:1, sortable:true, dataIndex:'fechaHora'},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus'},
            {text:'Observaciones', flex:1, sortable:true, dataIndex:'observaciones'}
        ];

        return cols;
    },

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
        var params = '?token=' + localStorage.getItem('Logeado');

        if(this.esSitio){
            params += '&idSitio=' + Ext.decode(localStorage.getItem('Usuario')).idSitio;
        }

        var store = new Ext.data.Store({
            model:'Historial',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletServicios' + params,
                reader:{
                    type:'json',
                    root:'data'
                }
            }),
            autoLoad:true
        });

        return store;
    },

    buildFields:function () { // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name:'nombreCliente', type:'string'},
            {name:'nombreTaxista', type:'string'},
            {name:'direccion', type:'string'},
            {name:'unidad', type:'string'},
            {name:'placas', type:'string'},
            {name:'fechaHora', type:'string'},
            {name:'estatus', type:'string'},
            {name:'observaciones', type:'string'}
        ];

        return fields;
    },

    buildDockedItems:function () {
        var me = this;
        return [
            {
                text: 'Actualizar',
                ui: 'inverse',
                iconCls: 'icon-refresh icon-white',
                handler: function(){
                    me.fireEvent("mask");
                    me.store.load();
                    me.fireEvent("unmask");
                }
            }
        ];
    },

    buildBbar:function () {
        var me = this, bBar, nombreC, direccion, movil, email, imei, unidad, placas, bReset;

        nombreC = me.buildTextField('nombreTaxista', 'nombre');
        direccion = me.buildTextField('nombreCliente', 'nombre');
        movil = me.buildDateField('fechaHora');
        email = me.buildCombo('estatus', 'estatus');
        bReset = Ext.create('Ext.Button', {text:'Limpiar', ui:'info', flex:1, iconCls:'icon-refresh icon-white', scope:this, handler:me.resetSearchs});

        bBar = [nombreC, direccion, movil, email, bReset];

        return bBar;
    },

    buildTextField:function (dataIndex, vtype) {
        var me = this,
            textField = {
                xtype:'textfield',
                id:dataIndex + me.id,
                flex:1,
                vtype:vtype,
                emptyText:dataIndex,
                listeners:{
                    scope:this,
                    change:me.filterStore
                }
            };

        return textField;
    },

    filterStore:function () {
        var me = this, i, value, textfields = ['nombreTaxista', 'nombreCliente', 'fechaHora', 'estatus'];
        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            value = Ext.getCmp(textfields[i] + me.id).getValue();
            if (!Ext.isEmpty(value)) {
                me.store.filter(textfields[i], value, true, false)
            }

        }

    },

    buildDateField: function (dataIndex, vtype){
        var me = this,
            dateField = {
                xtype: 'datefield',
                id: dataIndex + me.id,
                flex:1,
                emptyText: dataIndex,
                listeners: {
                    scope: this,
                    change:me.filterStore
                }
            };
        return dateField;
    },

    buildCombo:function (name, dataIndex) {
        var me = this, combo;

        combo = Ext.create('Ext.form.ComboBox', {
            id:dataIndex + this.id,
            store:me.buildStore().collect(dataIndex),
            emptyText:name,
            displayField:dataIndex,
            valueField:dataIndex,
            queryMode:'local',
            flex:1,
            listeners:{
                scope:this,
                change:function (t, nv, ov, eOpts) {
                    me.filterStore();
                }
            }
        });

        return combo;
    },

    resetSearchs:function () {
        var me = this, i, textfields = ['nombreTaxista', 'nombreCliente', 'fechaHora', 'estatus'];

        me.store.clearFilter(false);

        for (i = 0; i < textfields.length; i++) {
            Ext.getCmp(textfields[i] + me.id).reset();
        }
    }


});

Ext.define('App.view.admin.servicios.asignar.GridPanel', {
    extend:'Ext.grid.Panel',
    alias:'widget.gridpanelAsignar',
    requires:['App.view.admin.taxistas.GridPanel'],

    initComponent:function(){
        Ext.define('Servicio', {
            extend:'Ext.data.Model',
            fields:this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();

        this.callParent(arguments);
    },

    buildColumns:function () { // creamos las columnas de nuestro grid
        var cols = [
            {text:'Nombre Cliente', flex:1, sortable:true, dataIndex:'nombreCliente'},
            {text:'Nombre Taxista', flex:1, sortable:true, dataIndex:'nombreTaxista', hidden: this.esSitio},
            {text:'Dirección', flex:1, sortable:true, dataIndex:'direccion'},
            {text:'Unidad', flex:1, sortable:true, dataIndex:'unidad', hidden: this.esSitio},
            {text:'Placas', flex:1, sortable:true, dataIndex:'placas', hidden: this.esSitio},
            {text:'Fecha', flex:1, sortable:true, dataIndex:'fechaHora'},
            {text:'Estatus', flex:1, sortable:true, dataIndex:'estatus'},
            {text:'Observaciones', flex:1, sortable:true, dataIndex:'observaciones'}
        ];

        return cols;
    },
    buildDockedItems:function () {
        var me = this;
        return [
            {
                xtype:'toolbar',
                dock:'top',
                items:[
                    {
                        text: 'Asignar Taxi',
                        ui: 'success',
                        iconCls: 'icon-add icon-white',//icon-ok
                        handler: me.asignarTaxi.bind(me)
                    }
                ]
            }
        ];
    },
    buildFields:function () { // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name:'idServicio', type:'int'},
            {name:'idTaxista', type:'int'},
            {name:'nombreCliente', type:'string'},
            {name:'nombreTaxista', type:'string'},
            {name:'direccion', type:'string'},
            {name:'unidad', type:'string'},
            {name:'placas', type:'string'},
            {name:'fechaHora', type:'string'},
            {name:'estatus', type:'string'},
            {name:'observaciones', type:'string'}
        ];

        return fields;
    },

    buildStore:function () { //creamos nuestro store que contendra cada una de las entidades de nuestro tablero

        var store = new Ext.data.Store({
            model:'Servicio',
            storeId: 'storeAsignar',
            data:[]
        });

        return store;
    },

    asignarTaxi:function(){
        var me = this,
            recordSeleccionado = this.getSelectionModel().getSelection();
        if(recordSeleccionado[0]){
            var windowBuscarTaxista = Ext.create('Ext.window.Window',{
                title:'Buscar Taxista',
                id:'windowBuscarTaxista'+this.id,
                modal:true,
                width:600,
                height:450,
                items:[{
                    xtype:'gridpanelfilterT',
                    resumida: true,
                    esSitio: me.esSitio
                }],
                buttons:[{
                    text:'Aceptar',
                    handler:this.onSeleccionarTaxi.bind(me)
                },{
                    text:'Cancelar',
                    scope: this,
                    handler: function(){
                        windowBuscarTaxista.close();
                    }
                }]
            });

            windowBuscarTaxista.show();
        } else {
            Ext.MessageBox.alert('Información', 'Debes seleccionar un Servicio.');
        }
    },

    onSeleccionarTaxi:function(button){
        var me = this,
            window = Ext.getCmp('windowBuscarTaxista'+me.id),
            gridTaxistas = window.down('gridpanelfilterT'),
            servicioSeleccionado = me.getSelectionModel().getSelection(),
            taxistaSeleccionado = gridTaxistas.getSelectionModel().getSelection();

        if(taxistaSeleccionado[0]){
            var params = '?token=' + localStorage.getItem('Logeado') + '&idServicio=' + servicioSeleccionado[0].data.idServicio +
                '&idTaxista=' + taxistaSeleccionado[0].data.idTaxista;

            var invocation=new XMLHttpRequest(),
                url = 'http://isystems.com.mx:8181/Trinus/ServletOperadoraSitio'+params;
            if(invocation) {
                invocation.open('POST', url, true);
                invocation.onreadystatechange = function(response){
                    if (response.target.readyState == 4 && response.target.status == 200) {
                        var r = Ext.decode(response.target.responseText);
                        console.log('respuesta ServletOperadoraSitio' + r);
                        if (r.result == 'ok') {
                            me.getStore().remove(servicioSeleccionado[0]);
                            window.close();
                            Ext.MessageBox.alert('Información', '!Enhorabuena el servicio ha sido asignado¡');
                        }
                    }
                };
                invocation.send();
            }
        } else {
            Ext.MessageBox.alert('Información', 'Selecciona un taxista para continuar.');
        }
    }


});



