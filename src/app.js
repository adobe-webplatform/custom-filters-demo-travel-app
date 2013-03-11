define(function() {

	var app = {};
	return _.extend(app, Backbone.Events, {
		router: null,
		mainView: null
	});

});