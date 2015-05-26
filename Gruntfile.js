'use strict';
module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    clean: {
      files: [
        '.tmp',
        '.sass-cache'
      ]
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: 'scripts/<%= pkg.name %>.js',
        dest: '.tmp/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'scripts/<%= pkg.name %>.min.js'
      }
    },
    sass: {
      dist: {
        files: {
          'styles/<%= pkg.name %>.css': 'styles/<%= pkg.name %>.scss'
        }
      }
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:9000/test/<%= pkg.name %>.html']
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'scripts/.jshintrc'
        },
        src: [
          'scripts/**/*.js',
          '!scripts/**/*.min.js',
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'index.html',
          'test/index.html',
          'scripts/**/*.min.js',
          'styles/**/*.css'
        ]
      },
      scripts: {
        files: 'scripts/<%= pkg.name %>.js',
        tasks: ['concat', 'uglify']
      },
      styles: {
        files: 'styles/<%= pkg.name %>*.scss',
        tasks: ['sass']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    },
    connect: {
      options: {
        hostname: 'localhost',
        port: 9000,
        open: true,
        livereload: 35729
      },
      livereload: {
        base: '.'
      }
    },
    bump: {
      options: {
        commit: true,
        commitFiles: [
          'package.json',
          'bower.json',
          'scripts/jquery.minesweeper.js',
          'scripts/jquery.minesweeper.min.js'
        ],
        createTag: true,
        push: true,
        pushTo: 'origin',
        files: [
          'package.json',
          'bower.json',
          'scripts/jquery.minesweeper.js'
        ],
        regExp: new RegExp(
          '([\'|\"]?version[\'|\"]?[ ]*[:=][ ]*[\'|\"]?)(\\d+\\.\\d+\\.\\d+(-rc\\.\\d+)?(-\\d+)?)[\\d||A-a|.|-]*([\'|\"]?)',
          'gi'
        )
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'connect', 'qunit', 'clean', 'concat', 'uglify', 'sass']);
  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });
  grunt.registerTask('serve', ['connect:livereload', 'watch']);
  grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
