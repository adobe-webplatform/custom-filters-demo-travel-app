define(["views/touch-item-view",
        "views/touch-list-view",
        "tests/locations-view",
        "app"],
    function(TouchItemView,
            TouchListView,
            LocationsView,
            app) {

    var MoodLabels = [
        {
            label: "Do",
            className: "js-do-item-view",
            hue: 180,
            saturation: 23
        },
        {
            label: "See",
            className: "js-see-item-view",
            hue: 283,
            saturation: 15
        },
        {
            label: "Buy",
            className: "js-buy-item-view",
            hue: 6,
            saturation: 53

        },
        {
            label: "Eat",
            className: "js-eat-item-view",
            hue: 53,
            saturation: 54
        }
    ];

    var ItemView = TouchItemView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.$labelEl.addClass("js-mood-item-view-label");
            this._useFilter = true;
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-mood-item-view");
            return this;
        },

        _onTapStart: function() {
            if (app.mainView.navigatorView().nextCard())
                return;
            app.mainView.navigatorView().prepareNextCard(new LocationsView.view({
                hue: this.model.get("hue"),
                saturation: this.model.get("saturation")
            }).render());
        }
    });

    var MoodView = TouchListView.extend({

        initialize: function(options) {
            this.model = new Backbone.Collection();
            this.model.add(_.map(MoodLabels, function(item) {
                return new Backbone.Model(item);
            }));
            MoodView.__super__.initialize.call(this);
            this.on("activate", this._onViewActivated, this);
        },

        _onViewActivated: function() {
            app.router.navigate("test/" + encodeURIComponent("Mood View"), { trigger: false });
        },

        render: function() {
            this.$el.addClass("js-mood-view");
            return MoodView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({model: model}).render()
                .on("selected", this._onItemSelected, this);
        }

    });

    return {
        label: "Mood View",
        view: MoodView
    };

});