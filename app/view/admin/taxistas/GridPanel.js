Ext.define('App.view.admin.taxistas.GridPanel', {
    extend: 'Ext.grid.Panel',
    alias :'widget.gridpanelfilterT',

    initComponent: function(){
        var me = this;

        Ext.define('Taxi', {
            extend: 'Ext.data.Model',
            fields: this.buildFields()
        });

        this.store = this.buildStore();
        this.columns = this.buildColumns();

        this.callParent(arguments);
    },

    buildColumns:function(){ // creamos las columnas de nuestro grid
        var cols = [
            {text: 'Nombre', flex: 1, sortable: true, dataIndex: 'nombreCompleto'},
            {text: 'Dirección',          flex: 1, sortable: true,  dataIndex: 'direccion'},
            {text: 'Movil',      flex: 1, sortable: true,  dataIndex: 'movil'},
            {text: 'Email',   flex: 1, sortable: true,  dataIndex: 'email'},
            {text: 'Imei',        flex: 1, sortable: true,  dataIndex: 'imei'},
            {text: 'Unidad',        flex: 1, sortable: true,  dataIndex: 'unidad'},
            {text: 'Placas',        flex: 1, sortable: true,  dataIndex: 'placas'},
            {text: 'Contraseña',        flex: 1, sortable: true,  dataIndex: 'contrasena'}
        ];

        return cols;
    },

    buildStore:function(){ //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
        var store;

        store = new Ext.data.Store({
            model:'Taxi',
            proxy:new Ext.data.ScriptTagProxy({
                url:'http://isystems.com.mx:8181/Trinus/ServletTaxistas?token=' + localStorage.getItem('Logeado'),
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }),
            autoLoad:true
        });

        return store;
    },

    buildFields:function(){ // creamos la definicion de los slots, es decir qeu propiedades tienen
        var fields = [
            {name: 'nombreCompleto',  type: 'string'},
            {name: 'direccion',           type: 'string'},
            {name: 'movil',          type: 'string'},
            {name: 'email',    type: 'string'},
            {name: 'imei',         type: 'string'},
            {name: 'unidad',         type: 'string'},
            {name: 'placas',         type: 'string'},
            {name: 'contrasena',         type: 'string'}
        ];

        return fields;
    },

    buildBbar : function (){
        var me = this, bBar, crEngine, cBrowser, cPlatform, ceVersion, cCss, bReset;

        crEngine    = me.buildCombo('Nombre', 'nombre');
        cBrowser    = me.buildCombo('Dirección', 'direccion');
        cPlatform   = me.buildCombo('Movil', 'movil');
        ceVersion   = me.buildCombo('Email', 'email');
        cCss        = me.buildCombo('Imei', 'imei');
        bReset      = Ext.create('Ext.Button', {text: 'Reset', handler: function() { me.resetCombos();}});

        bBar = [crEngine,cBrowser,cPlatform,ceVersion,cCss, bReset];

        return bBar;
    },

    buildCombo:function(name, dataIndex){
        var me = this, combo;

        combo = Ext.create('Ext.form.ComboBox', {
            id: dataIndex+this.id,
            store: me.buildStore().collect(dataIndex),
            emptyText: name+'...',
            displayField: dataIndex,
            valueField: dataIndex,
            queryMode: 'local',
            flex:1,
            listeners:{
                scope:this,
                change:function(t, nv, ov, eOpts){
                    me.filterStore();
                }
            }
        });

        return combo;
    },

    filterStore:function(){
        var me = this, i, value, combos = ['rendering_engine', 'browser', 'platform', 'engine_version', 'css_grade'];

        me.store.clearFilter(false);

        for (i = 0; i < combos.length; i++){
            value = Ext.getCmp(combos[i]+me.id).getValue();
            if (!Ext.isEmpty(value)){
                me.store.filter(combos[i], value, true, false)
            }

        }

    },

    resetCombos:function(){
        var me = this, i, combos = ['rendering_engine', 'browser', 'platform', 'engine_version', 'css_grade'];

        me.store.clearFilter(false);

        for (i = 0; i < combos.length; i++){
            Ext.getCmp(combos[i]+me.id).reset();
        }
    }


});
