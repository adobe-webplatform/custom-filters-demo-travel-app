module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: grunt.file.readJSON('build.json')
      }
    },
    concat: {
      all: {
        src: [
          "../../third-party/prod/jquery-1.9.1.min.js",
          "../../third-party/prod/prefixfree.min.js",
          "../../third-party/dev/prefixfree.jquery.js",
          "../../third-party/prod/underscore-min.js",
          "../../third-party/prod/underscore.string.min.js",
          "../../third-party/prod/sylvester.js",
          "../../third-party/prod/backbone-min.js",
          "../../third-party/prod/require.js",
          "dist/main.min.js"
        ],
        dest: 'dist/all.min.js',
        options: {
          separator: ';\n\n',
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['requirejs', 'concat:all']);

};