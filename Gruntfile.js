/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: [ '<%= pkg.directories.build %>/' ],
            libs: [ '<%= bower.install.options.targetDir %>' ],
            js: [ '<%= concat.dist.src %>', '<%=concat.dist.dest %>' ],
            html: [ '<%= copy.dist.src %>' ]
        },
        bower: {
            install: {
                options: {
                    targetDir: '<%= pkg.directories.build %>/js/lib',
                    cleanBowerDir: true
                }
            }
        },
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            beforeConcat: [ '<%= pkg.directories.lib %>/js/*.js' ],
            afterConcat: [ '<%= pkg.directories.build %>/js/main.js' ]
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [ '<%= pkg.directories.lib %>/js/*.js' ],
                dest: '<%= pkg.directories.build %>/js/main.js'
            }
        },
        copy: {
            dist: {
                expand: true,
                cwd: '<%= pkg.directories.lib %>/',
                src: ['*.html'],
                dest: '<%= pkg.directories.build %>/'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> (<= pkg.version %>) <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= pkg.directories.build %>/js/main.min.js': [ '<%= pkg.directories.build %>/js/main.js' ]
                }
            }
        },
/*
        qunit: {
            dist: {}
        },
*/
        connect: {
            server: {
                options: {
                    base: '<%= pkg.directories.build %>',
                    middleware: function(connect, options) {
                        return [
                            connect.logger(),
                            connect.static(options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        },
        watch: {
            bower: {
                files: 'bower.json',
                tasks: [ 'clean:libs', 'bower' ]
            },
            js: {
                files: '<%= concat.dist.src %>',
                tasks: [ 'clean:js', 'build' ]
            },
            html: {
                files: '<%= copy.dist.src %>',
                tasks: [ 'clean:html', 'copy' ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
//  grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-bower-task');

    // Default task.
    grunt.registerTask('build', [ 'copy', 'jshint:beforeConcat', 'concat', 'jshint:afterConcat' ]);
    grunt.registerTask('minify', [ 'build', 'uglify' ]);
    grunt.registerTask('test', [ 'clean:dist', 'build'/*, 'qunit'*/ ]);
    grunt.registerTask('default', [ 'clean:dist', 'bower', 'build', /*'qunit',*/ 'uglify' ]);
    grunt.registerTask('debug', [ 'default', 'connect', 'watch' ]);

};
