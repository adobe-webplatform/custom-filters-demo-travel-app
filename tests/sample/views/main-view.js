define(['app',
        'mobileui/ui/window-view',
        'views/app-navigator-view',
        'tests/list'],
    function(app,
             WindowView,
             AppNavigatorView,
             TestsList)
    {

    var MainView = WindowView.extend({

        initialize: function() {
            MainView.__super__.initialize.call(this);
            this._navigatorView = new AppNavigatorView();
            this.append(this._navigatorView.render());
        },

        render: function() {
            MainView.__super__.render.call(this);
            this.$el.addClass("js-main-view");
            return this;
        },

        navigatorView: function() {
            return this._navigatorView;
        },

        pushViewCard: function(label) {
            var viewItem = _.find(TestsList, function(item) {
                return item.label == label;
            });
            if (!viewItem)
                return false;
            var ViewConstructor = viewItem.view;
            if (!ViewConstructor)
                return false;
            var view = new ViewConstructor().render();
            view.on("activated", function() {
                app.router.navigate("test/" + label);
            });
            app.mainView.navigatorView().pushCard(view);
            return true;
        }
    });

    app.on("init", function() {
        app.mainView = new MainView({
            el: $("#main").get(0)
        }).render();
    });

    return MainView;

});