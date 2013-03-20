define(["mobileui/ui/navigator-card-view",
        "mobileui/ui/list-view",
        "mobileui/views/layout-params",
        "mobileui/views/gesture-view",
        "app"],
    function(NavigatorCardView, ListView, LayoutParams, GestureView, app) {

    var MoodLabels = [
        {
            label: "The Abbey (club)"
        },
        {
            label: "Alameda Corridor"
        },
        {
            label: "Alex Theatre"
        },
        {
            label: "Ambassador Hotel (Los Angeles)"
        },
        {
            label: "Amoeba Music"
        },
        {
            label: "Andaz West Hollywood"
        },
        {
            label: "Anderton Court Shops"
        },
        {
            label: "Angels Flight"
        },
        {
            label: "Angelus Temple"
        },
        {
            label: "Los Angeles Aqueduct"
        },
        {
            label: "ArcLight Hollywood"
        },
        {
            label: "Avalon Hollywood"
        },
        {
            label: "Avenel Cooperative Housing Project"
        }
    ];

    var ItemView = GestureView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.on("tap", this._onTap, this);
            this.setParams(new LayoutParams().matchParentWidth());
            this.bounds().setHeight(100);
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this.$labelEl = $("<div />").addClass("js-location-item-view-label");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-location-item-view")
                .append(this.$labelEl)
                .css("background-color", "hsl(220, 30%, " + (20 + this.model.get("index")) + "%)");
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

    var LocationsView = NavigatorCardView.extend({

        initialize: function(options) {
            LocationsView.__super__.initialize.call(this);
            this.model = new Backbone.Collection();
            this.model.add(_.map(MoodLabels, function(item, i) {
                return new Backbone.Model(item).set("index", i);
            }));
            this._listView = new ListView().matchParentSize()
                .setItemRendererFactory(this._onItemRendererFactory.bind(this))
                .setCollection(this.model);
            this.append(this._listView.render());
        },

        render: function() {
            this.$el.addClass("js-locations-view");
            return LocationsView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({model: model}).render()
                .on("selected", this._onItemSelected, this);
        },

        _onItemSelected: function(model) {
            
        }

    });

    return {
        label: "Locations View",
        view: LocationsView
    };

});