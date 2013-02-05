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

    padding: '10 0 0 20',

    initComponent:function () {
        this.html = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function (){
        return [ '<div><form action="https://www.paypal.com/cgi-bin/webscr" method="post">' +
                '<input type="hidden" name="cmd" value="_s-xclick">' +
                '<input type="hidden" name="hosted_button_id" value="4ADVY6X24EM4J">' +
                '<table>' +
                '<tr><td><select name="os0">' +
                '<option value="Opción 1">Opción 1 $5.00 MXN</option>' +
                '<option value="Opción 2">Opción 2 $30.00 MXN</option>' +
                '<option value="Opción 3">Opción 3 $50.00 MXN</option>' +
                '<option value="Opción 4">Opción 4 $200.00 MXN</option>' +
                '</select>' +
                '<td><input type="hidden" name="currency_code" value="MXN"></td>' +
                '<td><input type="image" style="margin-top: 25px; margin-left: 10px;" src="https://www.paypalobjects.com/es_XC/MX/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal, la forma más segura y rápida de pagar en línea."></td></tr>' +
                '</table>' +
                '</form></div>'
        ]
    }
});


