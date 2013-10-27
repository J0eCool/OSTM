module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        reporter: 'checkstyle',
        reporterOutput: 'build/lint.xml'
      },
      build: {
        options: {          
          ignores: ['src/lib/*.js'],
          
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
          'build/<%= pkg.name %>.min.js': ['src/**/*.js']
        }
      }
    },
    concat: {
      build: {
        files: {
          'build/game.min.css': ['css/**/*.css']
        }
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'concat']);

};