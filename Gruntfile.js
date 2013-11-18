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
          '-W099': true, //disable "mixed spaces and tabs" warning
          '-W103': true //disable __proto__ warning
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
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'less', 'autoprefixer', 'cssmin']);
};