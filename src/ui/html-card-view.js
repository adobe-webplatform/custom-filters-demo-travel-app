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

define(["mobileui/ui/scroll-card-view",
        "mobileui/views/layout-params",
        "mobileui/views/measured-view"],
function(ScrollCardView, LayoutParams, MeasuredView) {

    var HtmlCardView = ScrollCardView.extend({

        initialize: function() {
            HtmlCardView.__super__.initialize.call(this);

            this._contentView = new MeasuredView();
            this._contentView.setParams(new LayoutParams().matchParentWidth());
            this.scrollView().setContentView(this._contentView.render());
        },

        render: function() {
            this.$el.addClass("js-html-card-view");
            return HtmlCardView.__super__.render.call(this);
        },

        contentView: function() {
            return this._contentView;
        }

    });

    return HtmlCardView;
});