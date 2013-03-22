module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sencha_dependencies: {
            app: {
                options : {
                    appFile: 'app/app.js',
                    senchaDir: 'extjs/',
                    printDepGraph: true
                }
            }
        },
        uglify: {
            app: {
                options: {
                    sourceMap: 'build/source-map.js',
                    compress: true
                },
                files: {
                    'build/app.min.js': [
                        "app/app.js",
                        "app/view/login/FormPanel.js",
                        "app/view/principal/Panel.js",
                        "app/view/admin/Panel.js",
                        "app/view/registro/FormPanel.js",
                        "app/view/menu/MenuPanel.js",
                        "app/view/xtemplate/XtemplateTaxista.js",
                        "app/view/recarga/FormPanel.js",
                        "app/view/admin/MenuAdminPanel.js",
                        "app/view/admin/taxistas/Panel.js",
                        "app/view/admin/clientes/Panel.js",
                        "app/view/admin/servicios/historial/Panel.js",
                        "app/view/admin/servicios/asignar/Panel.js",
                        "app/view/xtemplate/XtemplateTitulo.js",
                        "app/view/menu/FormPanel.js",
                        "app/view/admin/taxistas/GridPanel.js",
                        "app/view/admin/clientes/GridPanel.js",
                        "app/view/admin/servicios/historial/GridPanel.js",
                        "app/view/admin/servicios/asignar/GridPanel.js",
                        "app/util/VTypes.js"
                    ]
                }
            }
        },
        copy: {
            app: {
                files: [
                    {expand: true, src: ['resources/css/app/app.css'], dest: 'build/', cwd: 'extjs/'},
                    {expand: true, src: ['resources/sass/**'], dest: 'build/', cwd: 'extjs'},
                    {src: ['index.html'], dest: 'build/'}
                ],
                options: {
                    processContent: function(content, filePath) {
                        // process only the index.html content
                        if (/index.html/.test(filePath)) {
                            // remove the ext script
                            content = content.replace(/<script.*ext.js"><\/script>/, '');
                            // now update the css location
                            content = content.replace(/\.\.\/extjs\//, '');
                            // now change our app.js to app.min.js
                            content = content.replace(/app\/app.js/, 'app.min.js');
                        }
                        return content;
                    }
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-sencha-dependencies');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['sencha_dependencies:app', 'uglify:app', 'copy:app']);

};
