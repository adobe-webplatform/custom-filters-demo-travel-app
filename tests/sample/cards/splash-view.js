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

    var SplashLabels = [
        {
            label: "Slide up to start",
            className: "js-la-item-view"
        }
    ];

    var ItemView = TouchItemView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.$labelEl.addClass("js-splash-item-view-label");
            this.setEffect("warp");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.filterView().$el.addClass("js-splash-item-view");
            return this;
        },

        _onTapStart: function() {
            if (app.mainView.navigatorView().nextCard())
                return;
            app.mainView.navigatorView().prepareNextCard(app.router.lookupCard("City View"));
        }
    });

    var SplashView = TouchListView.extend({

        isDefaultScreen: true,

        initialize: function(options) {
            this.model = new Backbone.Collection();
            this.model.add(_.map(SplashLabels, function(item) {
                return new Backbone.Model(item);
            }));
            SplashView.__super__.initialize.call(this);
        },

        url: function() {
            return "card/" + encodeURIComponent("Splash View");
        },

        render: function() {
            this.$el.addClass("js-splash-view");
            return SplashView.__super__.render.call(this);
        },

        _createTouchListItemView: function(model) {
            return new ItemView({model: model});
        },

        _internalShouldUseVerticalLayout: function() {
            return false;
        }

    });

    return {
        label: "Splash View",
        view: SplashView
    };

});