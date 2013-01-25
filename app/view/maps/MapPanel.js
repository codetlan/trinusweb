/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 00:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.maps.MapPanel', {
    extend:'Ext.ux.GMapPanel',
    alias:'widget.mappanel',

    zoomLevel:200,
    plain:true,
    gmapType:'map',
    mapTypeId: google.maps.MapTypeId.HYBRID,

    center:{
        geoCodeAddr: 'Ciudad Universitaria, Mexico DF'
    },

    markers: [{
        lat: 19.310414,
        lng: -99.170301,
        title: 'JOJOJOJOJ'
    }],


    initComponent:function () {
        console.info(this);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setCoordenada.bind(this), this.gestionaErrores);
        } else {
            alert('Tu navegador no soporta la API de geolocalizacion');
        }
        this.callParent(arguments);
    },

    setCoordenada:function (position) {
        Ext.apply(this, {
            markers:[{
                title: 'Codetlan',
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }]
        });
        /*this.addMarker({
            title: 'Codetlan',
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });*/
    },
    gestionaErrores:function (err) {
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
