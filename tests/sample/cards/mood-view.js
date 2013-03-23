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
            this.useFoldingFilters();
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-mood-item-view");
            return this;
        },

        _onTapStart: function() {
            if (app.mainView.navigatorView().nextCard())
                return;
            app.mainView.navigatorView().prepareNextCard(app.router.lookupCard("Locations View",
                this.model.get("hue") + ":" + this.model.get("saturation")));
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

        url: function() {
            return "card/" + encodeURIComponent("Mood View");
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