module.exports = function(grunt) {
  var printSizes = false;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    updatePkg: grunt.file.readJSON('update.json'),
    deployFolder: 'build/deploy/<%= pkg.version %>',
    debugFolder: 'build/debug/<%= pkg.version %>',
    liveDeployFolder: '../gh-pages',

    clean: {
      build: ['build/*.*', '<%= deployFolder %>', '<%= debugFolder %>']
    },
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
          '-W097': true, //allow non-function 'use strict'
          '-W099': true, //disable "mixed spaces and tabs" warning
          '-W103': true, //disable __proto__ warning
        },
        src: ['src/**/*.js']
      }
    },
    concat: {
      build: {
        files: {
          'build/less.less': ['css/**/*.less'],
          'build/game.unprocessed.js': ['src/**/*.js']
        }
      }
    },
    preprocess: {
      options: {
        context: {
          version: '<%= pkg.version %>'
        }
      },
      build: {
        options: {
          context: {
            DEBUG: false
          },
        },
        files: {
          'build/index.html': 'index.html',
          'build/game.js': 'build/game.unprocessed.js'
        }
      },
      debug: {
        options: {
          context: {
            DEBUG: true
          },
        },
        files: {
          'build/index.debug.html': 'index.html',
          'build/game.debug.js' : 'build/game.unprocessed.js'
        }
      }
    },
    uglify: {
      options: {
        report: printSizes && 'min'
      },
      build: {
        files: {
          'build/game.min.js': 'build/game.js'
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
        files: [
          {expand: true, flatten: true, dest: '<%= deployFolder %>', src: ['build/game.min.css', 'build/game.min.js',
            'build/index.html', 'img/**/*.png', 'update.json', 'privacy.html']},
        ]
      },
      debug: {
        files: [
          {dest: '<%= debugFolder %>/index.html', src: ['build/index.debug.html']},
          {dest: '<%= debugFolder %>/game.js', src: ['build/game.debug.js']},
          {expand: true, flatten: true, dest: '<%= debugFolder %>', src: ['build/game.css',
            'img/**/*.png', 'update.json', 'privacy.html']},
        ]
      }
    },

    // Deploy
    githubPages: {
      deploy: {
        options: {
          commitMessage: 'Push <%= pkg.version %>'
        },
        src: '<%= deployFolder %>',
        dest: '<%= liveDeployFolder %>'
      }
    },
  });

  // Load the plugins
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['clean', 'jshint', 'concat', 'preprocess', 'uglify', 'less', 'autoprefixer', 'cssmin', 'copy']);

  if (grunt.config('pkg').version === grunt.config('updatePkg').version) {
    grunt.registerTask('deploy', ['default', 'githubPages']);
  }
  else {
    grunt.log.error('package.json and update.json version mismatch; unable to deploy');
  }
};