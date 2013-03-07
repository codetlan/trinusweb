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
        var _this = this, items = [
            {
                descargas:[],
                xtype:"menuadmin",
                region:"west",
                title:"Menu",
                id:"Menu" + this.id,
                bbar:this.buildBbar(),
                flex:1,
                scope:this,
                opciones:[
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
                    },
                    {
                        iconCls:'icon-list-alt',
                        text:'Asignar Unidades',
                        scope:this,
                        cls:'Asignar'
                    }
                ],
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
                id:titulo + this.id,
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
            this.items.items[1].setActiveTab(titulo + this.id);
        } else {
            this.items.items[1].setActiveTab(titulo + this.id);
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
        console.log(response);
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