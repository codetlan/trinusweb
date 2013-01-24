/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 00:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.maps.MapPanel', {
    extend: 'Ext.ux.GMapPanel',
    alias: 'widget.mappanel',

    zoomLevel: 14,
    gmapType: 'map',
    setCenter: {
        lat: 19.310414,
        lng: -99.170301,
        marker: {title: 'Codetlan'}
    },


    initComponent : function(){

        this.callParent(arguments);
    }
});
