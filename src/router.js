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
			require(["views/projects-view", "models/projects", "data/projects"], 
			function(ProjectsView, Projects, DataProjects) {
				var projects = new Projects();
				projects.reset(DataProjects);
				app.mainView.setContentView(new ProjectsView({
					model: projects
				}));
			});
		},

		project: function(id) {
			require(["views/project-view", "models/projects", "data/projects"], 
			function(ProjectView, Projects, DataProjects) {
				var projects = new Projects();
				projects.reset(DataProjects);
				app.mainView.setContentView(new ProjectView({
					model: projects.get(id)
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