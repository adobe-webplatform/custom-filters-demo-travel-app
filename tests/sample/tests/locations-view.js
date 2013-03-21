define(["views/touch-item-view",
        "views/touch-list-view",
        "mobileui/views/layout-params",
        "app"],
    function(TouchItemView,
            TouchListView,
            LayoutParams,
            app) {

    var LocationLabels = [
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

    var ItemView = TouchItemView.extend({
        initialize: function(options) {
            _.extend(this, options);
            ItemView.__super__.initialize.call(this);
            this.$labelEl.addClass("js-location-item-view-label");
        },

        setVerticalLayout: function() {
            this._verticalLayout = true;
            this.setParams(new LayoutParams().matchParentWidth());
            this.bounds().setHeight(100);
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-location-item-view")
                .css("background-color", "hsl(" + this.hue + ", " + this.saturation + "%, " + (28 + this.model.get("index") * 2) + "%)");
            return this;
        },

        _onTapStart: function() {
            app.mainView.navigatorView().prepareNextCard(app.mainView.lookupCard("Location View"));
        }
    });

    var LocationsView = TouchListView.extend({

        initialize: function(options) {
            this.hue = 283;
            this.saturation = 15;
            _.extend(this, options);
            this.model = new Backbone.Collection();
            this.model.add(_.map(LocationLabels, function(item, i) {
                return new Backbone.Model(item).set("index", i);
            }));
            LocationsView.__super__.initialize.call(this);
            this.listView().setScrollDirection("vertical");
            this.listView().contentView().setParams(new LayoutParams()
                    .matchParentWidth().matchChildrenHeight());
            this.setVerticalLayout();
        },

        render: function() {
            this.$el.addClass("js-locations-view");
            return LocationsView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({ model: model, hue: this.hue, saturation: this.saturation }).render()
                .on("selected", this._onItemSelected, this);
        }

    });

    return {
        label: "Locations View",
        view: LocationsView
    };

});