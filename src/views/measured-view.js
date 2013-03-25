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
        "mobileui/views/layout-params"], function(LayerView, LayoutParams) {

    var MeasuredView = LayerView.extend({
        render: function() {
            this.$el.addClass("js-measured-view");
            this.$contentView = this.createContentElement()
                .addClass("js-measured-view-content");
            this.$el.append(this.$contentView);
            return MeasuredView.__super__.render.call(this);
        },

        setContent: function(html) {
            this.$contentView.html(html);
            this.setNeedsLayout(true);
            return this;
        },

        setTextContent: function(html) {
            this.$contentView.text(html);
            this.setNeedsLayout(true);
            return this;
        },

        content: function() {
            return this.$contentView;
        },

        createContentElement: function() {
            return $("<div />");
        },

        layout: function() {
            this.layoutBounds();
            this.layoutChildren();
            var params = this.params(),
                hasParentDerivedWidth = params && params.hasParentDerivedWidth(),
                hasParentDerivedHeight = params && params.hasParentDerivedHeight();
            if (this.checkInvalidationFlag("size")) {
                this.$contentView.css("width", hasParentDerivedWidth ? this.bounds().width() : "");
                this.$contentView.css("height", hasParentDerivedHeight ? this.bounds().height() : "");
            }
            if (!hasParentDerivedWidth)
                this.bounds().setWidth(this.$contentView.outerWidth());
            if (!hasParentDerivedHeight)
                this.bounds().setHeight(this.$contentView.outerHeight());

            this.setNeedsLayout(false);
        }
    });

    return MeasuredView;

});