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

    requires:['App.view.login.FormPanel', 'App.view.principal.Panel'],

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
                height: 200,
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

    iniciar:function(){
        if(this.window){
            this.window.destroy();
        }
        Ext.create('Ext.container.Viewport',{
           layout: 'fit',
            items:[{
                xtype:'panelprincipal'
            }]
        });
    }
});