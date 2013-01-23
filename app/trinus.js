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
    /**
     * @method
     * @template
     * Called automatically when the page has completely loaded.
     */
    launch:function () {
        alert(123456);
    }
});