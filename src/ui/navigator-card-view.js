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

define(["mobileui/views/layer-view",
        "mobileui/views/layout-params"],
function(LayerView, LayoutParams) {

    var NavigatorCardView = LayerView.extend({

        initialize: function() {
            NavigatorCardView.__super__.initialize.call(this);
            this.matchParentSize();
            this._navigatorView = null;
            this.on("activate", this.updateRouterLocation, this);
        },

        render: function() {
            this.$el.addClass("js-navigator-card-view");
            return NavigatorCardView.__super__.render.call(this);
        },

        // Called by the navigator when this view is set active.
        _setNavigatorView: function(navigatorView) {
            this._navigatorView = navigatorView;
            this.trigger("change:navigatorView");
            this.trigger(this._navigatorView ? "attached" : "detached");
            return this;
        },

        updateRouterLocation: function() {
            // override this method.
        },

        navigatorView: function() {
            return this._navigatorView;
        },

        topBarView: function() {
            return this._navigatorView ? this._navigatorView.topBarView() : null;
        }

    });

    return NavigatorCardView;
});