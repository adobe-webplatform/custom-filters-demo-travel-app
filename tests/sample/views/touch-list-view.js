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
        "app"],
    function(AppCardView, ListView, LayoutParams, app) {

    var TouchListView = AppCardView.extend({

        initialize: function(options) {
            TouchListView.__super__.initialize.call(this);
            this._listView = new ListView().matchParentSize()
                .setItemRendererFactory(this._onItemRendererFactory.bind(this))
                .setCollection(this.model)
                .setScrollDirection("none");
            this._listView.contentView().matchParentSize();
            this.append(this._listView.render());
            this.on("deactivate", this._onDeactivate, this);
            this._useVerticalLayout = null;
            // Force a 3D layer.
            this.animation();
            this.transform().clear();
        },

        listView: function() {
            return this._listView;
        },

        render: function() {
            this.$el.addClass("js-touch-list-view");
            return TouchListView.__super__.render.call(this);
        },

        _onItemRendererFactory: function(model) {
            return this._createTouchListItemView(model).render()
                .on("selected", this._onItemSelected, this);
        },

        _onItemSelected: function(selectedView, promiseList) {
            var self = this,
                selectedViewIndex = this._listView.indexOfView(selectedView);
            this.model.each(function(model, index) {
                var view = self._listView.itemView(model);
                if (!view || view == selectedView)
                    return;
                view.animateViewDeactived(promiseList, self._listView, selectedView, index - selectedViewIndex);
            });
        },

        _onDeactivate: function() {
            var self = this;
            this.model.each(function(model) {
                var view = self._listView.itemView(model);
                if (view)
                    view.resetAnimations();
            });
        },

        setUseVerticalLayout: function(useVerticalLayout) {
            if (this._useVerticalLayout == useVerticalLayout)
                return;
            if (useVerticalLayout)
                this.setVerticalLayout();
            else
                this.setHorizontalLayout();
        },

        _internalShouldUseVerticalLayout: function() {
            return true;
        },

        layout: function() {
            this.setUseVerticalLayout(this._internalShouldUseVerticalLayout());
            TouchListView.__super__.layout.call(this);
        },

        setVerticalLayout: function() {
            this._useVerticalLayout = true;
            var self = this;
            this.model.each(function(model) {
                var view = self._listView.itemView(model);
                if (!view)
                    return;
                view.setVerticalLayout();
            });
            this._listView.contentView().setLayout("vertical");
        },

        setHorizontalLayout: function() {
            this._useVerticalLayout = false;
            var self = this;
            this.model.each(function(model) {
                var view = self._listView.itemView(model);
                if (!view)
                    return;
                view.setHorizontalLayout();
            });
            this._listView.contentView().setLayout("horizontal");
        }

    });

    return TouchListView;

});