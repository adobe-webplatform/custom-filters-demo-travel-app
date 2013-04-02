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
        "mobileui/views/layer-view",
        "mobileui/utils/transform",
        "app"],
    function(AppCardView, LayerView, Transform, app) {

    var PictureView = AppCardView.extend({
        initialize: function(options) {
            PictureView.__super__.initialize.call(this);
            this.addGestureDetector();
            this.on("tap", this._onTap, this);
            this._initialView = null;
            this._needsTopBar = false;

            this._pictureView = new LayerView().matchParentSize().addClass("js-picture-view");
            this.append(this._pictureView.render());
            if (options && options.path) {
                var data = decodeURIComponent(options.path).split(":");
                this._pictureView.$el.css("background-color", data[0])
                    .append($("<div />")
                        .css("font-size", "2.5em")
                        .addClass("center")
                        .text(data[1]));
            }
        },

        _computeViewTransform: function(view) {
            if (!view)
                return new Transform().translate(0, 0).scale(1, 1);
            var rect = view.getScreenRect();
            return new Transform().translate(rect.left, rect.top)
                .scale(rect.width / this.navigatorView().bounds().width(), 
                    rect.height / this.navigatorView().bounds().height());
        },

        _onActivate: function(options) {
            this._needsTopBar = false;

            if (options.goingBack)
                return PictureView.__super__._onAppCardViewActivate.call(this, options);
            
            this.updateRouterLocation();

            app.startTransition();
            
            this._initialView = options.scaleFrom;
            this._pictureView.transform().take(this._computeViewTransform(this._initialView));

            this._pictureView.animation().start().get("show")
                .chain()
                .transform(100, new Transform().translate(0, 0).scale(1, 1))
                .callback(function() {
                    app.endTransition(this);
                    this._updateNavigationBar();
                }, this);
            options.promise = this._pictureView.animation().promise();
        },

        _animateBackButton: function(nextCard, options) {
            if (!this._initialView)
                return PictureView.__super__._animateBackButton.call(this, nextCard, options);

            var self = this;
            app.startTransition();
            
            this._pictureView.animation().start().get("show")
                .chain()
                .transform(100, this._computeViewTransform(this._initialView))
                .callback(function() {
                    app.endTransition(this);
                }, this);
            
            options.promise = this._pictureView.animation().promise();
        },

        _onDragStart: function() {
            this._needsTopBar = true;
            this._updateNavigationBar();
            PictureView.__super__._onDragStart.call(this);
        },

        needsTopBar: function() {
            return this._needsTopBar;
        },

        url: function() {
            return "card/" + encodeURIComponent("Picture View");
        },

        render: function() {
            this.$el.addClass("js-picture-view-container");
            return PictureView.__super__.render.call(this);
        },

        _onTap: function() {
            this._needsTopBar = !this._needsTopBar;
            this._updateNavigationBar();
        }

    });

    return {
        label: "Picture View",
        view: PictureView
    };

});