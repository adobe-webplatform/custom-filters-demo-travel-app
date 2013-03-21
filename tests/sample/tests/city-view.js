define(["views/touch-item-view",
        "views/touch-list-view",
        "app"],
    function(TouchItemView,
            TouchListView,
            app) {

    var CityLabels = [
        {
            label: "Mood",
            className: "js-mood-item-view"
        },
        {
            label: "Location",
            className: "js-location-item-view"
        },
        {
            label: "Search",
            className: "js-search-item-view"
        }
    ];

    var ItemView = TouchItemView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.$labelEl.addClass("js-city-item-view-label");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-city-item-view");
            return this;
        },

        _onTapStart: function() {
            app.mainView.navigatorView().prepareNextCard(app.mainView.lookupCard("Mood View"));
        }
    });

    var CityView = TouchListView.extend({

        initialize: function(options) {
            this.model = new Backbone.Collection();
            this.model.add(_.map(CityLabels, function(item) {
                return new Backbone.Model(item);
            }));
            CityView.__super__.initialize.call(this);
            this.on("activate", this._onViewActivated, this);
        },

        _onViewActivated: function() {
            app.router.navigate("test/" + encodeURIComponent("City View"), { trigger: false });
        },

        render: function() {
            this.$el.addClass("js-city-view");
            return CityView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({model: model}).render()
                .on("selected", this._onItemSelected, this);
        },

        _internalShouldUseVerticalLayout: function() {
            this.layoutBounds();
            return this.bounds().width() < 550;
        }

    });

    return {
        label: "City View",
        view: CityView
    };

});