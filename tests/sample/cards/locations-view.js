/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
        },
        {
            label: "The Abbey (club)"
        }
    ];

    var ItemView = TouchItemView.extend({
        initialize: function(options) {
            _.extend(this, options);
            ItemView.__super__.initialize.call(this);
            this.$labelEl.addClass("js-location-item-view-label");
            this._useFilter = true;
        },

        setVerticalLayout: function() {
            this._verticalLayout = true;
            this.setParams(new LayoutParams().matchParentWidth());
            this.bounds().setHeight(100);
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-location-item-view")
                .css("background-color", "hsl(" + this.hue + ", " + this.saturation + "%, " + Math.min(100, 28 + this.model.get("index") * 2) + "%)");
            return this;
        },

        _onTapStart: function() {
            if (app.mainView.navigatorView().nextCard())
                return;
            app.mainView.navigatorView().prepareNextCard(app.router.lookupCard("Location View"));
        }
    });

    var LocationsView = TouchListView.extend({

        initialize: function(options) {
            this.hue = 283;
            this.saturation = 15;
            if (options && options.path) {
                var data = options.path.split(":");
                this.hue = parseInt(data[0], 10);
                this.saturation = parseInt(data[1], 10);
            }
            this.model = new Backbone.Collection();
            this.model.add(_.map(LocationLabels, function(item, i) {
                return new Backbone.Model(item).set("index", i);
            }));
            LocationsView.__super__.initialize.call(this);
            this.listView().setScrollDirection("vertical");
            this.listView().contentView().setParams(new LayoutParams()
                    .matchParentWidth().matchChildrenHeight());
            this.setVerticalLayout();
            this.on("activate", this._onViewActivated, this);
            this.on("deactivate", this._onViewDeactivated, this);
        },

        url: function() {
            return "card/" + encodeURIComponent("Locations View") + "/" + this.hue + ":" + this.saturation;
        },

        _onViewActivated: function() {
            app.mainView.navigatorView().listButton().show();
            app.mainView.navigatorView().gridButton().show();
        },

        _onViewDeactivated: function() {
            app.mainView.navigatorView().listButton().hide();
            app.mainView.navigatorView().gridButton().hide();
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