module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bower_concat: {
			all: {
				dest: 'dist/lib.js',
				bowerOptions: {
					relative: false
				}
			}
		},

		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: [ 'src/*.js'],
				dest: 'dist/<%= pkg.name %>.js',
			},
		}
	});

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['bower_concat', 'concat']);
};