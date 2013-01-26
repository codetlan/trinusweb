Ext.define('App.view.principal.Panel', {
    extend: 'Ext.panel.Panel',
    alias :'widget.panelprincipal',
    requires: ['Ext.toolbar.Toolbar','App.view.menu.MenuPanel'/*,'App.view.maps.MapPanel'*/],

    layout:'border',


    initComponent:function(){
        this.items = this.buildItems();
        this.tbar = this.buildBbar();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                xtype:'menupanel',
                region:'west',
                flex:.2
            },{
                xtype:'container',
                region:'center',
                flex:1,
                html:'<div id="map_canvas" style="height: 100%; width: 100%;"></div>',
                //id:'map_canvas',
                listeners:{
                    scope:this,
                    afterrender:this.onAfterRenderMapPanel
                }
            }
        ];

        return items;
    },

    buildBbar: function(){
        var toolbar =  Ext.create('Ext.toolbar.Toolbar',{
            xtype: 'container',
            items: ['->',{
                xtype: 'button',
                text: 'Usuario',
                icon: 'images/user.png'
            },{
                xtype: 'button',
                text: 'Salir',
                icon: 'images/user.png',
                handler: this.salir
            }]
        });

        return toolbar;
    },

    salir: function(){
        localStorage.removeItem('Logeado');
        location.href='index.html';
    },

    onAfterRenderMapPanel:function(t, eOpts){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.createMap.bind(this), this.gestionaErroresGeo);
        } else {
            alert('Tu navegador no soporta la API de geolocalizacion');
        }
    },

    createMap:function (position) {
        var _this = this,
            mapOptions = {
                zoom:14,
                center:new google.maps.LatLng(position.coords.latitude, position.coords.longitude),

                mapTypeId:google.maps.MapTypeId.ROADMAP
            },
            latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            geocoder = new google.maps.Geocoder(),
            infowindow = new google.maps.InfoWindow();

        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        geocoder.geocode({'latLng':latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    _this.map.setZoom(16);
                    var marker = new google.maps.Marker({
                        draggable:true,
                        position:latlng,
                        map:_this.map
                    });
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(_this.map, marker);

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(_this.map,marker);
                    });
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
    }
});