Ext.define('App.view.xtemplate.XtemplateTaxista', {
    extend:'Ext.DataView',
    alias:'widget.xtemplatetaxista',

    emptyText:'No hay taxistas disponibles',
    tpl:'',
    style:{
        fontFamily:'orbitron-light',
        paddingTop:'20px'
    },


    initComponent:function () {
        this.tpl = this.tplTaxista();

        this.callParent(arguments);
    },

    tplTaxista:function () {
        return '<div style="text-align: center;"><font color="#999"; face="orbitron-light"; size=6 >Detalles del Taxista</font></div><br>' +
            '<div><img height="140" style="border: 2px solid #99BBE8; width:100px; margin: 2px; float: left;"  src="images/man.png" ></div>' +
            '<div>Nombre:<br><font color="#999";> Juan Carlos Jimenez Torres</font></div>' +
            '<div>No. del Taxi:<br><font color="#999"; size=3 > 12345635</font></div>' +
            '<div>Placas:<br><font color="#999"; size=3 > IJG874NJD</font></div>';
            /*'<div><font color="#333"; face="orbitron-light"; size=4 >Tu saldo actual es de:</font></div><br><br>' +
            '<div><form action="https://www.paypal.com/cgi-bin/webscr" method="post">' +
            '<input type="hidden" name="cmd" value="_s-xclick">' +
            '<input type="hidden" name="hosted_button_id" value="4ADVY6X24EM4J">' +
            '<table>' +
            '<tr><td style="color: #0088cc; font-size: 15pt;">Recarga Credito</td></tr>' +
            '<tr><td><select name="os0">' +
            '<option value="Opción 1">Opción 1 $5.00 MXN</option>' +
            '<option value="Opción 2">Opción 2 $30.00 MXN</option>' +
            '<option value="Opción 3">Opción 3 $50.00 MXN</option>' +
            '<option value="Opción 4">Opción 4 $200.00 MXN</option>' +
            '</select>' +
            '<td><input type="hidden" name="currency_code" value="MXN"></td>' +
            //'<td><input type="image" width="165" src="images/icono-paypal.jpg" border="0" name="submit" alt="PayPal, la forma más segura y rápida de pagar en línea."></td></tr>' +
            '<td><input type="image" style="margin-top: 25px; margin-left: 10px;" src="https://www.paypalobjects.com/es_XC/MX/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal, la forma más segura y rápida de pagar en línea."></td></tr>' +
            '</table>' +
            '</form></div>';*/
    }




});
