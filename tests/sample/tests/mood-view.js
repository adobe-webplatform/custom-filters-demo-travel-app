define(["views/touch-item-view",
        "views/touch-list-view",
        "app"],
    function(TouchItemView,
            TouchListView,
            app) {

    var MoodLabels = [
        {
            label: "Do",
            className: "js-do-item-view"
        },
        {
            label: "See",
            className: "js-see-item-view"
        },
        {
            label: "Buy",
            className: "js-buy-item-view"
        },
        {
            label: "Eat",
            className: "js-eat-item-view"
        }
    ];

    var ItemView = TouchItemView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.$labelEl.addClass("js-mood-item-view-label");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-mood-item-view");
            return this;
        },

        _onTapStart: function() {
            app.mainView.navigatorView().prepareNextCard(app.mainView.lookupCard("Locations View"));
        }
    });

    var MoodView = TouchListView.extend({

        initialize: function(options) {
            this.model = new Backbone.Collection();
            this.model.add(_.map(MoodLabels, function(item) {
                return new Backbone.Model(item);
            }));
            MoodView.__super__.initialize.call(this);
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