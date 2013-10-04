module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('Checker.jquery.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
              '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
              '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
              ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        min: {
          dist: {
            src: ['src/<%= pkg.name %>.js'],
            dest: 'dist/<%= pkg.name %>.min.js'
          }
        },
        // Task configuration.
        clean: {
          files: ['dist']
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    hostname: '*',
                    keepalive: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ['css']
                },
                files: {
                    "css/main.css": "css/main.less"
                }
            }
        },
        qunit: {
          files: ['test/**/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('default', ['connect:server', 'less', 'qunit']);
}