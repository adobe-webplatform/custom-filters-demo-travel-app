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
        "mobileui/views/layout-view",
        "mobileui/views/content-view",
        "app"],
    function(TouchItemView,
            TouchListView,
            LayotView,
            ContentView,
            app) {

    var SplashLabels = [
        {
            label: "Los Angeles",
            className: "js-la-item-view"
        }
    ];

    var ItemView = TouchItemView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);

            this._layoutView = new LayotView()
                .matchParentSize()
                .setLayout("vertical");
            this._filterView.append(this._layoutView.render());

            this._travelGuideView = new ContentView()
                .setTextContent("Travel Guide")
                .addClass("js-splash-item-view-guide-label");
            this._travelGuideView.ensureParams().matchParentWidth().fillParentHeight().matchLineHeight(true);
            this._travelGuideView.padding().setTop(30);
            this._layoutView.append(this._travelGuideView.render());

            this._labelView = new ContentView();
            this._labelView.$el.append(this.$labelEl.addClass("js-splash-item-view-label"));
            this._labelView.ensureParams().matchParentWidth().fillParentHeight();
            this._layoutView.append(this._labelView.render());

            this._exploreContentView = new ContentView()
                .setTextContent("Explore Content")
                .addClass("js-splash-item-view-explore-label");
            this._exploreContentView.ensureParams().matchParentWidth().fillParentHeight().matchLineHeight(true);
            this._exploreContentView.padding().setBottom(30);
            this._layoutView.append(this._exploreContentView.render());

            this.setEffect("warp");
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.filterView().$el.addClass("js-splash-item-view");
            return this;
        },

        layout: function() {
            ItemView.__super__.layout.call(this);
            this.$labelEl.css("font-size", Math.min(this._labelView.bounds().height() / 2,
                this._labelView.bounds().width() / 8) + "px");
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

        displaysOnTop: function() {
            return true;
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