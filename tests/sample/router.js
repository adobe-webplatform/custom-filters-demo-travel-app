define(["require", "app", "views/index-view"], function(require, app, IndexView) {

    var Router = Backbone.Router.extend({
        routes: {
            "test/*path/*options": "test",
            "test/*path": "test",
            "*path": "index"
        },

        index: function() {
            app.mainView.navigatorView().pushCard(new IndexView().render());
        },

        test: function(path, pathOptions) {
            var view = app.mainView.lookupCard(decodeURIComponent(path), decodeURIComponent(pathOptions));
            app.mainView.navigatorView().pushCard(view ? view : new IndexView().render());
        }
    });

    var router = app.router = new Router();

    app.on("start", function() {
        Backbone.history.start();
    });

    return router;
});