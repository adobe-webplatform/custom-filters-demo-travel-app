define(["require", "app"], function(require, app) {

    var Router = Backbone.Router.extend({
        routes: {
            "test/*path": "test",
            "*path": "index"
        },

        index: function(path) {
            require(["views/index-view"], function(IndexView) {
                app.mainView.navigatorView().pushCard(new IndexView().render());
            });
        },

        test: function(path) {
            require(["views/index-view"], function(IndexView) {
                var indexView = new IndexView({ path: path }).render();
                if (!app.mainView.navigatorView().activeCard())
                    app.mainView.navigatorView().pushCard(indexView);
            });
        }
    });

    var router = app.router = new Router();

    app.on("start", function() {
        Backbone.history.start();
    });

    return router;
});