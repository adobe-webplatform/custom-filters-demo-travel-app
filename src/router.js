define(["require", "app"], function(require, app) {
	
	var Router = Backbone.Router.extend({
		routes: {
			"projects": "projects",
			"project/:id": "project",
			"*path": "index"
		},

		index: function(path) {
			require(["views/index-view"], function(IndexView) {
				app.mainView.setContentView(new IndexView());
			});
		},

		projects: function() {
			require(["views/projects-view"], function(ProjectsView) {
				app.mainView.setContentView(new ProjectsView());
			});
		},

		project: function(id) {
			require(["views/project-view"], function(ProjectView) {
				app.mainView.setContentView(new ProjectView({
					model: id
				}));
			});
		}
	});

	var router = app.router = new Router();

	app.on("start", function() {
		Backbone.history.start();
	});

	return router;
});