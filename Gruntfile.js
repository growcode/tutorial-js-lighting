var marked = require('marked');
var Handlebars = require('handlebars');

module.exports = function (grunt) {
	grunt.initConfig({
		mark: {
			all: {
				files: [{
					src: 'README.md',
					dest: 'README.html'
				}],
				template: 'template.html',
				options: {
					gfm: true
				}
			}
		},
		watch: {
			compass: {
				files: ['*.md'],
				tasks: ['mark'],
				options: {}
			}
		}
	});

	grunt.registerMultiTask('mark', 'Process markdown', function () {
		var data = this.data;
		marked.setOptions(data.options);

		var template = null;
		if (data.template) {
			template = Handlebars.compile([
				'<!-- THIS IS A GENERATED FILE - DO NOT EDIT -->',
				grunt.file.read(data.template)
			].join('\n'));
		}

		data.files.forEach(function(file) {
			var content = marked(grunt.file.read(file.src[0]))

			if (template) {
				content = template({ markdown: content });
			}

			grunt.file.write(
				file.dest,
				content
			);
		});
	});

	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['mark', 'watch']);
};
