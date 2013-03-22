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

define(["mobileui/ui/navigator-card-view",
        "mobileui/views/scroll-view"],
function(NavigatorCardView, ScrollView) {

    var ScrollCardView = NavigatorCardView.extend({

        initialize: function() {
            ScrollCardView.__super__.initialize.call(this);
            this._scrollView = new ScrollView()
                    .matchParentSize()
                    .setScrollDirection(ScrollView.VERTICAL);
            this.append(this._scrollView.render());
        },

        render: function() {
            this.$el.addClass("js-scroll-card-view");
            return ScrollCardView.__super__.render.call(this);
        },

        scrollView: function() {
            return this._scrollView;
        }

    });

    return ScrollCardView;
});