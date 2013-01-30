Ext.define('App.view.xtemplate.XtemplateTaxista', {
    extend:'Ext.DataView',
    alias:'widget.xtemplatetaxista',

    emptyText: 'No hay taxistas disponibles',
    tpl: '',
    style:{
        fontFamily: 'orbitron-light',
        paddingTop: '20px'
    },


    initComponent: function(){
        this.tpl = this.tplTaxista();

        this.callParent(arguments);
    },

    tplTaxista: function(){
        return '<div style="text-align: center;"><font color="#999"; face="orbitron-light"; size=6 >Detalles del Taxista</font></div><br>'+
            '<div><img height="140" style="border: 2px solid #99BBE8; width:100px; margin: 2px; float: left;"  src="images/man.png" ></div>'+
            '<div>Nombre:<br><font color="#999";> Juan Carlos Jimenez Torres</font></div>'+
            '<div>No. del Taxi:<br><font color="#999"; size=3 > 12345635</font></div>'+
            '<div>Placas:<br><font color="#999"; size=3 > IJG874NJD</font></div><br><br>'+
            '<div><font color="#333"; face="orbitron-light"; size=4 >Tu saldo actual es de:</font></div>';
    }




});
