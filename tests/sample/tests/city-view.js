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
            if (app.mainView.navigatorView().nextCard())
                return;
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