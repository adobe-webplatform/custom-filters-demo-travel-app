define(['app',
        'mobileui/ui/window-view',
        'mobileui/ui/navigator-view'],
    function(app,
             WindowView,
             NavigatorView)
    {

    var MainView = WindowView.extend({

        initialize: function() {
            this._navigatorView = new NavigatorView();
            this.append(this._navigatorView.render());
            MainView.__super__.initialize.call(this);
        },

        render: function() {
            MainView.__super__.render.call(this);
            this.$el.addClass("js-main-view");
            return this;
        },

        navigatorView: function() {
            return this._navigatorView;
        }
    });

    app.on("init", function() {
        app.mainView = new MainView({
            el: $("#main").get(0)
        }).render();
    });

    return MainView;

});