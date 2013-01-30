Ext.define('App.view.xtemplate.XtemplateTitulo', {
    extend:'Ext.DataView',
    alias:'widget.xtemplatetitulo',

    emptyText: 'No hay taxistas disponibles',
    tpl: '',
    style:{
        backgroundColor: '#333',
        lineHeight: '90px',
        fontSize:  '80pt',
        fontFamily: 'orbitron-medium',
        textAlign: 'center',
        paddingTop: '20px'
    },

    initComponent: function(){
        this.tpl = this.tplTaxista();

        this.callParent(arguments);
    },

    tplTaxista: function(){
         return '<font color="FFC332">Trinus</font>';
    }




});
