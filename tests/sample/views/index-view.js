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

define(["views/app-card-view",
        "mobileui/ui/list-view",
        "mobileui/views/layout-params",
        "mobileui/views/measured-view",
        "cards/list",
        "tests/list",
        "app"],
    function(AppCardView, ListView, LayoutParams,
        MeasuredView, CardsList, TestsList, app) {

    var ItemView = MeasuredView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.addGestureDetector();
            this.on("tap", this._onTap, this);
            this.setParams(new LayoutParams().matchParentWidth());
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this.padding().setAll(10);
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-item-view");
            this._onLabelChanged();
            return this;
        },

        _onLabelChanged: function() {
            this.setTextContent(this.model.get("label"));
        },

        _onTap: function() {
            this.trigger("selected", this.model);
        }
    });

    var IndexView = AppCardView.extend({

        initialize: function(options) {
            IndexView.__super__.initialize.call(this);
            this.model = new Backbone.Collection();
            this.model.add(_.map(CardsList, function(item) {
                return new Backbone.Model(item);
            }));
            this.model.add(_.map(TestsList, function(item) {
                return new Backbone.Model(item);
            }));
            this.on("activate", this._onViewActivated, this);
            this.on("deactivate", this._onViewDeactivated, this);
        },

        _onViewActivated: function() {
            app.mainView.navigatorView().backButton().hide();
        },

        _onViewDeactivated: function() {
            app.mainView.navigatorView().backButton().show();
        },

        render: function() {
            this.$el.addClass("js-index-view");
            this._listView = new ListView().matchParentSize()
                .setItemRendererFactory(this._onItemRendererFactory.bind(this))
                .setCollection(this.model);
            this.append(this._listView.render());
            return IndexView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return new ItemView({model: model}).render()
                .on("selected", this._onItemSelected, this);
        },

        _onItemSelected: function(model) {
            app.mainView.navigatorView().pushCard(
                app.router.lookupCard(model.get("label")));
        },

        url: function() {
            return "/";
        }

    });

    return IndexView;

});