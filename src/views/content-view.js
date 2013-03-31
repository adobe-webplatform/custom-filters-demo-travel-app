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

    var ContentView = LayerView.extend({
        initialize: function() {
            ContentView.__super__.initialize.call(this);
            this.$contentView = this.createContentElement()
                .addClass("js-content-view-content");
            this._html = null;
            this._text = null;
        },

        render: function() {
            this.$el.addClass("js-content-view");
            this.$el.append(this.$contentView);
            return ContentView.__super__.render.call(this);
        },

        _validateHtml: function() {
            if (this._html) {
                this.$contentView.html(this._html);
                this._html = null;
            }
        },

        _validateText: function() {
            if (this._text) {
                this.$contentView.text(this._text);
                this._text = null;
            }
        },

        setContent: function(html) {
            this._text = null;
            this._html = html;
            this.setNeedsLayout(true);
            return this;
        },

        setTextContent: function(text) {
            this._html = null;
            this._text = text;
            this.setNeedsLayout(true);
            return this;
        },

        addContentClass: function(className) {
            this.$contentView.addClass(className);
            return this;
        },

        content: function() {
            return this.$contentView;
        },

        createContentElement: function() {
            return $("<div />");
        },

        layout: function() {
            ContentView.__super__.layout.call(this);
            this._validateHtml();
            this._validateText();
        }
    });

    return ContentView;

});