Ext.define('App.view.xtemplate.XtemplateTaxista', {
    extend:'Ext.DataView',
    alias:'widget.xtemplatetaxista',

    style:{
        fontFamily:'orbitron-light',
        paddingTop:'20px',
        paddingLeft: '20px',
        lineHeight: '25px'
    },


    initComponent:function () {
        this.tpl = this.tplTaxista();

        this.callParent(arguments);
    },

    tplTaxista:function () {
        var  template = new Ext.XTemplate('<tpl for=".">'+
            '<tpl if="nombre">'+
            '<div class="media">'+
            '<div style="text-align: center;">'+
                '<h3 class="media-heading">Detalles del Taxista</h3>'+
            '</div>' +
            '<img height="140" style="border: 2px solid #99BBE8; width:100px; float: left;" class="media-object" src="images/man.png">'+
            '<div style="padding-left: 115px;">Nombre:<br><font color="#999";> {nombre}</font><br>' +
            'No. del Taxi:<br><font color="#999"> {unidad}</font><br>' +
            'Placas:<br><font color="#999" > {placas}</font></div>' +
            '</div>'+
            '<tpl else>'+
            '<div class="media">'+
            '<div style="text-align: center;">'+
            '<h3 class="media-heading">Detalles del Taxista</h3><br>'+
            '<img id="detail-icon-img" src="http://cdn1.iconfinder.com/data/icons/customicondesignoffice2/128/FAQ.png" alt="answer, confusion, faq, question icon">'+
            '</div>' +
            '</div>' +
            '</tpl>'+
            '</tpl>');

        return template;


    }




});
