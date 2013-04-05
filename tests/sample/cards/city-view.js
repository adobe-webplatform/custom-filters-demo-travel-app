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

define(["mobileui/ui/touch-item-view",
        "mobileui/ui/touch-list-view",
        "views/url-card-view-mixin",
        "app"],
    function(TouchItemView,
            TouchListView,
            UrlCardViewMixin,
            app) {

    var CityLabels = [
        {
            label: "Mood",
            className: "js-city-mood-item-view"
        },
        {
            label: "Location",
            className: "js-city-location-item-view"
        },
        {
            label: "Search",
            className: "js-city-search-item-view"
        }
    ];

    var ItemView = TouchItemView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.addModelLabel().addClass("js-city-item-view-label");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.filterView().$el.addClass("js-city-item-view");
            return this;
        },

        _onTapStart: function() {
            if (app.mainView.navigatorView().nextCard())
                return;
            app.mainView.navigatorView().prepareNextCard(app.router.lookupCard("Mood View"));
        }
    });

    var CityView = TouchListView.extend(_.extend({

        initialize: function(options) {
            this.model = new Backbone.Collection();
            this.model.add(_.map(CityLabels, function(item) {
                return new Backbone.Model(item);
            }));
            CityView.__super__.initialize.call(this);
        },

        url: function() {
            return "card/" + encodeURIComponent("City View");
        },

        render: function() {
            this.$el.addClass("js-city-view");
            return CityView.__super__.render.call(this);
        },

        _createTouchListItemView: function(model) {
            return new ItemView({model: model});
        },

        _internalShouldUseVerticalLayout: function() {
            this.layoutBounds();
            return this.bounds().width() < 600;
        }

    }, UrlCardViewMixin));

    return {
        label: "City View",
        view: CityView
    };

});