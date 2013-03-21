define(['mobileui/ui/navigator-view',
        'mobileui/ui/button-view',
        'views/index-view'], function(NavigatorView, ButtonView, IndexView) {

    var AppNavigatorView = NavigatorView.extend({

        initialize: function() {
            AppNavigatorView.__super__.initialize.call(this);
            this.addTopBarButtons();
        },

        render: function() {
            this.$el.addClass("js-app-navigator-view");
            return AppNavigatorView.__super__.render.call(this);
        },

        addTopBarButtons: function() {
            var topBar = this.topBarView();
            this._backButton = new ButtonView().setLabel("Back")
                .on("tap", this._onBackButtonTap, this);
            this._backButton.margin().setLeft(10).setTop(5);
            topBar.append(this._backButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-back-button-view"));

            topBar.appendFiller();

            this._listButton = new ButtonView().setLabel("List").hide();
            this._listButton.margin().setRight(10).setTop(5);
            topBar.append(this._listButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-list-button-view"));

            this._gridButton = new ButtonView().setLabel("Grid").hide();
            this._gridButton.margin().setRight(10).setTop(5);
            topBar.append(this._gridButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-grid-button-view"));
        },

        backButton: function() {
            return this._backButton;
        },

        listButton: function() {
            return this._listButton;
        },

        gridButton: function() {
            return this._gridButton;
        },

        _onBackButtonTap: function() {
            if (!this.popCard())
                this.pushCard(new IndexView().render());
        }

    });

    return AppNavigatorView;

});