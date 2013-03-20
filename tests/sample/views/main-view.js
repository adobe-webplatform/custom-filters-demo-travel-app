define(['app',
        'mobileui/ui/window-view',
        'mobileui/ui/button-view',
        'mobileui/ui/navigator-view',
        'views/index-view',
        'tests/list'],
    function(app,
             WindowView,
             ButtonView,
             NavigatorView,
             IndexView,
             TestsList)
    {

    var MainView = WindowView.extend({

        initialize: function() {
            MainView.__super__.initialize.call(this);
            this._navigatorView = new NavigatorView();
            this.append(this._navigatorView.render());
            this.addTopBarButtons();
        },

        render: function() {
            MainView.__super__.render.call(this);
            this.$el.addClass("js-main-view");
            return this;
        },

        navigatorView: function() {
            return this._navigatorView;
        },

        backButton: function() {
            return this._backButton;
        },

        addTopBarButtons: function() {
            var topBar = this._navigatorView.topBarView();
            this._backButton = new ButtonView().setLabel("Back")
                .on("tap", this._onBackButtonTap, this);
            this._backButton.margin().setLeft(10).setTop(5);
            topBar.append(this._backButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-back-button-view"));

            topBar.appendFiller();

            this._listButton = new ButtonView().setLabel("List");
            this._listButton.margin().setRight(10).setTop(5);
            topBar.append(this._listButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-list-button-view"));

            this._gridButton = new ButtonView().setLabel("Grid");
            this._gridButton.margin().setRight(10).setTop(5);
            topBar.append(this._gridButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-grid-button-view"));
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
        },

        _onBackButtonTap: function() {
            if (!app.mainView.navigatorView().popCard())
                app.mainView.navigatorView().pushCard(new IndexView().render());
        }
    });

    app.on("init", function() {
        app.mainView = new MainView({
            el: $("#main").get(0)
        }).render();
    });

    return MainView;

});