define(["mobileui/ui/navigator-card-view",
        "mobileui/ui/list-view",
        "mobileui/ui/button-view",
        "mobileui/views/layout-params",
        "mobileui/views/gesture-detector",
        "mobileui/views/measured-view",
        "tests/list",
        "app"],
    function(NavigatorCardView, ListView, ButtonView, LayoutParams, GestureDetector, MeasuredView, TestsList, app) {

    var ItemView = MeasuredView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this._gestureDetector = new GestureDetector(this);
            this.on("tap", this._onTap, this);
            this.setParams(new LayoutParams().matchParentWidth());
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this.padding().setAll(10);
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-item-view");
            this._onLabelChanged();
            return this;
        },

        _onLabelChanged: function() {
            this.setTextContent(this.model.get("label"));
        },

        _onTap: function() {
            this.trigger("selected", this.model);
        }
    });

    var IndexView = NavigatorCardView.extend({

        initialize: function(options) {
            IndexView.__super__.initialize.call(this);
            this.model = new Backbone.Collection();
            this.model.add(_.map(TestsList, function(item) {
                return new Backbone.Model(item);
            }));
            if (options && options.path) {
                var testModel = this.model.find(function(item) {
                    return item.get("label") == options.path;
                });
                if (testModel)
                    this._onItemSelected(testModel);
            }
            this.addTopBarButtons();
        },

        addTopBarButtons: function() {
            var topBar = app.mainView.navigatorView().topBarView();
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

        activated: function() {
            this._backButton.hide();
        },

        deactivated: function() {
            this._backButton.show();
        },

        render: function() {
            this.$el.addClass("js-index-view");
            this._listView = new ListView().matchParentSize()
                .setItemRendererFactory(this._onItemRendererFactory.bind(this))
                .setCollection(this.model);
            this.append(this._listView.render());
            return IndexView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({model: model}).render()
                .on("selected", this._onItemSelected, this);
        },

        _onItemSelected: function(model) {
            var ViewConstructor = model.get("view");
            if (!ViewConstructor)
                return;
            var view = new ViewConstructor().render();
            view.on("activated", function() {
                app.router.navigate("test/" + model.get("label"));
            });
            app.mainView.navigatorView().pushCard(view);
        },

        updateRouterLocation: function() {
            app.router.navigate("/");
        },

        _onBackButtonTap: function() {
            if (!app.mainView.navigatorView().popCard())
                app.mainView.navigatorView().pushCard(this);
        }

    });

    return IndexView;

});