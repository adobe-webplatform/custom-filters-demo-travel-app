define(["mobileui/ui/navigator-card-view",
        "mobileui/ui/list-view",
        "mobileui/views/layout-params",
        "mobileui/views/gesture-view",
        "app"],
    function(NavigatorCardView, ListView, LayoutParams, GestureView, app) {

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

    var ItemView = GestureView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.on("tap", this._onTap, this);
            this.setParams(new LayoutParams().fillParentHeight().matchParentWidth());
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this.$labelEl = $("<div />").addClass("js-mood-item-view-label");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-mood-item-view")
                .addClass(this.model.get("className"))
                .append(this.$labelEl);
            this._onLabelChanged();
            return this;
        },

        _onLabelChanged: function() {
            this.$labelEl.text(this.model.get("label"));
        },

        _onTap: function() {
            this.trigger("selected", this.model);
        }
    });

    var MoodView = NavigatorCardView.extend({

        initialize: function(options) {
            MoodView.__super__.initialize.call(this);
            this.model = new Backbone.Collection();
            this.model.add(_.map(MoodLabels, function(item) {
                return new Backbone.Model(item);
            }));
            this._listView = new ListView().matchParentSize()
                .setItemRendererFactory(this._onItemRendererFactory.bind(this))
                .setCollection(this.model)
                .setScrollDirection("none");
            this._listView.contentView().matchParentSize();
            this.append(this._listView.render());
        },

        render: function() {
            this.$el.addClass("js-mood-view");
            return MoodView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({model: model}).render()
                .on("selected", this._onItemSelected, this);
        },

        _onItemSelected: function(model) {
            
        }

    });

    return {
        label: "Mood View",
        view: MoodView
    };

});