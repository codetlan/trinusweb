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
            '<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----">' +
            '<input type="image" style="margin-top: 25px; margin-left: 10px;"  src="https://www.paypalobjects.com/es_XC/MX/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal, la forma más segura y rápida de pagar en línea.">' +
            '<img alt="" border="0" src="https://www.paypalobjects.com/es_XC/i/scr/pixel.gif" width="1" height="1"></td>' +
            '</table>' +
            '</form>' ]
    }
});


