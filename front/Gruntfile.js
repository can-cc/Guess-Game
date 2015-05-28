module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: 'app/js/main.js',
                dest: 'dest/js/main.min.js'

            }
        },
        copy: {
            jvendor: {
                src: 'app/js/vendor/*.js', // copy all files and subfolders
                dest: 'dest/js/vendor', // destination folder
                expand: true // required when using cwd
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['uglify', 'copy']);

};
