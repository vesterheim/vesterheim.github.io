'use strict';

module.exports = function(grunt) { 
  // Project configuration.
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'js/app.js': ['js/matchmedia.js', 'js/picturefill.js', 'js/breadcrumbs.js', 'js/tiles.js', 'js/swipe.js']
        }
      }
    },
    imagemin: {                          // Task
      myTask: {                          // Target
        options: {                       // Target options
          expand: true,
          optimizationLevel: 7,
          progressive: true,
  //        use: [mozjpeg()]
        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: '_site/assets/images/',                   // Src matches are relative to this path
          src: ['**/*.{jpg,png}'],   // Actual patterns to match //
          dest: '_site/assets/images/'                  // Destination path prefix
        }]
      },
    },
    imageoptim: {
      jpg: {
        options: {
          jpegMini: false,
          imageAlpha: false,
          quitAfter: true
        },
        src: ['_site/assets/images/**/*.jpg']
      },  
      png: {
        options: {
          jpegMini: false,
          imageAlpha: true,
          quitAfter: true
        },
        src: ['_site/assets/images/**/*.png']
      }
    },        
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },     
      all: [
        'Gruntfile.js',
        'js/*.js',
        '!js/fitvids.js',
        '!js/matchmedia.js',
        '!js/modernizr.js',
        '!js/picturefill.js',
        '!js/swipe.js',        
      ],
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      check: {
        src: [
          'css/**/*.css',
          '!css/style-old.css'
        ]
      }
    },  
    cssmin: {
      my_target: {
        files: [{
          expand: true,
          cwd: '_site/css/',
          src: [
           '*.css',
           '!*.min.css',
           '!main.css',
           '!style-old.css',
           '!typography.css'
          ],
          dest: '_site/css/',
//          ext: '.min.css'
        }]
      }
    }    
  });

//  grunt.loadNpmTasks('grunt-contrib-imagemin');
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['imagemin']);

};