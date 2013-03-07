//Ext.define('Ext.class.GlobalFunctions', {
//function aplicarVtypes () {
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        nombreMask:/^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/,
        nombreText:'Nombre no v&aacute;lido',
        nombre:function (val, field) {
            var regExp = /^[(a-zA-Z0-9 \u00e1\u00c1\u00e9\u00c9\u00ed\u00cd\u00f3\u00d3\u00fa\u00da\u00f1\u00d1.\,\/\-)]+$/;
            ///^[a-zA-Z ][-_.a-zA-Z0-9 ]{0,30}$/;
            return regExp.test(val);
        },
        numMask:/[\d\$.]/,
        num:function (val, field) {
            return val;
        }
    });
//}