define(["mobileui/ui/navigator-card-view",
        "mobileui/ui/list-view",
        "mobileui/views/layout-params",
        "mobileui/views/gesture-view",
        "app"],
    function(NavigatorCardView, ListView, LayoutParams, GestureView, app) {

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

    var ItemView = GestureView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.on("tap", this._onTap, this);
            this.setParams(new LayoutParams().fillParentWidth().matchParentHeight());
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this.$labelEl = $("<div />").addClass("js-city-item-view-label");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-city-item-view")
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

    var CityView = NavigatorCardView.extend({

        initialize: function(options) {
            CityView.__super__.initialize.call(this);
            this.model = new Backbone.Collection();
            this.model.add(_.map(CityLabels, function(item) {
                return new Backbone.Model(item);
            }));
            this._listView = new ListView().matchParentSize()
                .setItemRendererFactory(this._onItemRendererFactory.bind(this))
                .setCollection(this.model)
                .setScrollDirection("none");
            this._listView.contentView().setLayout("horizontal").matchParentSize();
            this.append(this._listView.render());
        },

        render: function() {
            this.$el.addClass("js-city-view");
            return CityView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({model: model}).render()
                .on("selected", this._onItemSelected, this);
        },

        _onItemSelected: function(model) {
            
        }

    });

    return {
        label: "City View",
        view: CityView
    };

});