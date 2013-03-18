define(["require", "app"], function(require, app) {

    var Router = Backbone.Router.extend({
        routes: {
            "projects": "projects",
            "project/:id": "project",
            "*path": "index"
        },

        index: function(path) {
            require(["views/index-view"], function(IndexView) {
                app.mainView.navigatorView().pushCard(new IndexView().render());
            });
        },

        projects: function() {
            require(["views/projects-view", "models/projects", "data/projects"],
            function(ProjectsView, Projects, DataProjects) {
                var projects = new Projects();
                projects.reset(DataProjects);
                app.mainView.navigatorView().pushCard(new ProjectsView({
                    model: projects
                }).render());
            });
        },

        project: function(id) {
            require(["views/project-view", "models/projects", "data/projects"],
            function(ProjectView, Projects, DataProjects) {
                var projects = new Projects();
                projects.reset(DataProjects);
                app.mainView.navigatorView().pushCard(new ProjectView({
                    model: projects.get(id)
                }).render());
            });
        }
    });

    var router = app.router = new Router();

    app.on("start", function() {
        Backbone.history.start();
    });

    return router;
});