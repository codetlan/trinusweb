Ext.define('App.view.admin.MenuAdminPanel', {
    extend:'Ext.panel.Panel',
    alias:'widget.menuadmin',

    frame:true,
    opciones:null,


    initComponent:function () {
        var _u = Ext.BLANK_IMAGE_URL;

        var _menu = '<ul id="task-views">';
        Ext.each(this.opciones, function (item) {
            item.id = Ext.id();
            _menu += '<li>' +
                '		<img style="width:20px;" src="' + _u + '" class="' + item.iconCls + '"/>' +
                '		<a id="' + item.id + '" class="' + item.cls + '" href="#">' + item.text + '</a>' +
                '</li>';
        }, this);
        _menu += '</ul>';
        Ext.apply(this, {
            html:_menu
        });

        this.callParent(arguments);
        this.on("afterrender", this.onafterRender);
    },

    onafterRender:function () {
        var _this = this;
        this.body.on('click', function (e,t) {
            Ext.each(_this.opciones, function (item) {
                if(e.getTarget('a.'+item.cls)){
                    _this.titulo = item.text;
                    _this.panel = item.cls;
                }
            }, _this);

            if(this.titulo){
                this.fireEvent("opcion", this.titulo,this.panel);
            }
        }, this);
    }
});
