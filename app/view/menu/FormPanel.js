/**
 * Created with JetBrains PhpStorm.
 * User: Waldix
 * Date: 24/01/13
 * Time: 14:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.menu.FormPanel', {
    extend:'Ext.form.FormPanel',
    alias:'widget.formpanel',

    bodyPadding:15,

    defaults:{
        labelWidth:140,
        width:370,
        style: {
            fontFamily: 'orbitron-medium'
        },
        padding: '20'
    },


    initComponent:function () {
        this.items = this.buildItems();

        this.callParent(arguments);
    },

    buildItems:function () {
        var items = [
            {
                xtype:'textfield',
                fieldLabel:'Ubicaci&oacute;n Actual',
                name:'txtOrigen'
            },
            {
                xtype:'textfield',
                fieldLabel:'Destino',
                name:'txtDestino',
                emptyText:'No obligatorio'
            },
            {
                xtype: 'container'
            },
            {
                xtype:'button',
                text:'Pedir Taxi',
                scope:this,
                ui:'warning',
                scale:'large',
                handler:function(){
                    this.fireEvent('pedirtaxi');
                }
            }
        ];

        return items;
    },

    setAddressText:function (address) {
        this.items.items[1].items.items[0].setValue(address);
    }/*,

     tplTaxista: function(){
     var imageTpl = new Ext.XTemplate(
     '<div><img height="110" style="border: 2px solid #99BBE8; width:100px; margin: 2px; float: left;"  src="images/man.png" ></div>',
     '<div><font color="#999"; face="orbitron-light"; size=3 >Nombre:</font> Juan Carlos Jimenez Torres </div>',
     '<div><font color="#999"; face="orbitron-light"; size=3 >No. del Taxi:</font> 12345635 </div>',
     '<div><font color="#999"; face="orbitron-light"; size=3 >Placas:</font> IJG874NJD </div>',
     '<div><font color="#999"; face="orbitron-light"; size=3 >Tiempo de llegada:</font> 24 min.</font></div>',
     '<div><font color="#999"; face="orbitron-light"; size=3 >Clasificaci&oacute;n: </font></div>'
     );
     return imageTpl;
     }  */
});


