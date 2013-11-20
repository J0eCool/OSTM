module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // JavaScript tasks
    jshint: {
      options: {
        reporter: 'checkstyle',
        reporterOutput: 'build/lint.xml'
      },
      build: {
        options: {          
          ignores: ['src/lib/*.js'],
          
          '-W061': true, //disable eval warning
          '-W069': true, //disable dot-notation warning
          '-W099': true, //disable "mixed spaces and tabs" warning
          '-W103': true, //disable __proto__ warning
        },
        src: ['src/**/*.js']
      }
    },
    uglify: {
      options: {
        report: 'min'
      },
      build: {
        files: {
          'build/game.min.js': ['src/**/*.js']
        }
      }
    },

    // CSS tasks
    concat: {
      build: {
        files: {
          'build/less.less': ['css/**/*.less'],
          'build/game.js': ['src/**/*.js']
        }
      }
    },
    less: {
      build: {
        files: {
          'build/less.css': 'build/less.less'
        }
      }
    },
    autoprefixer: {
      build: {
        files: {
          'build/game.css': 'build/less.css'
        }
      }
    },
    cssmin: {
      build: {
        files: {
          'build/game.min.css': 'build/game.css'
        }
      }
    },

    // Bundle
    copy: {
      build: {
        files: {
          'build/deploy/': ['build/game.min.css', 'build/game.min.js', 'index.html', 'img/**']
        }
      }
    },
  });

  // Load the plugins
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'less', 'autoprefixer', 'cssmin', 'copy']);
};