// bootstrap
require.config({
	paths: {
		'use': 'libs/use',
		'jquery': 'http://code.jquery.com/jquery-1.11.0.min',
		'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
		'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min'
	},
	use: {
		backbone: {
			deps: ['underscore', 'jquery'],
			attach: 'Backbone'
		}
	}
});


require(['use!backbone'], function(Backbone) {
	console.log(Backbone);
});