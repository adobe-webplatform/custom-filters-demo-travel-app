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

define(["mobileui/views/layout-view"], function(LayoutView) {

    var WindowView = LayoutView.extend({
        initialize: function() {
            WindowView.__super__.initialize.call(this);
            // Keep a reference to the main view so that DialogView can attach itself to the window.
            WindowView.instance = this;
            $(window).on("resize", this._onWindowResize.bind(this));
            this._onWindowResize();
            // Make sure we eat all the events before reaching the browser,
            // to prevent any default scrolling behavior.
            this.setNeedsTouchEvents(true);
        },

        render: function() {
            this.$el.addClass("js-window-view");
            return WindowView.__super__.render.call(this);
        },

        // Overwrite this function to return the main element of the WindowView.
        // It's used in DialogView to apply effects when a new Dialog is shown.
        contentView: function() {
            return null;
        },

        _onWindowResize: function() {
            this.bounds()
                .setSize(window.innerWidth, window.innerHeight);
            this.setNeedsLayout(true);
        }
    });

    WindowView.instance = null;

    return WindowView;
});