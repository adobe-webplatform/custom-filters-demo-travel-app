define(["require", "app", "views/index-view"], function(require, app, IndexView) {

    var Router = Backbone.Router.extend({
        routes: {
            "test/*path": "test",
            "*path": "index"
        },

        index: function() {
            app.mainView.navigatorView().pushCard(new IndexView().render());
        },

        test: function(path) {
            var view = app.mainView.lookupCard(decodeURIComponent(path));
            app.mainView.navigatorView().pushCard(view ? view : new IndexView().render());
        }
    });

    var router = app.router = new Router();

    app.on("start", function() {
        Backbone.history.start();
    });

    return router;
});