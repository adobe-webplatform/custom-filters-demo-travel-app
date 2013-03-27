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

define(["mobileui/views/gesture-view"], function(GestureView) {

    var ButtonView = GestureView.extend({
        initialize: function() {
            ButtonView.__super__.initialize.call(this);
            this.forceLayer();
            this._label = "Button";
            this.bounds().setSize(70, 40);
            this.on("tapstart", this._onTapStart, this);
            this.on("tapend", this._onTapEnd, this);
            this._state = "up";
            this._prevState = null;
            this.$labelEl = $("<div />").addClass("js-button-view-label");
        },

        setLabel: function(label) {
            this._label = label;
            this.invalidate("label");
            return this;
        },

        render: function() {
            ButtonView.__super__.render.call(this);
            this.$el.addClass("js-button-view")
                    .append(this.$labelEl);
            this._validateLabel();
            this._validateState();
            return this;
        },

        _validateLabel: function() {
            this.$labelEl.text(this._label);
        },

        _validateState: function() {
            if (this._prevState)
                this.$el.removeClass("js-button-view-" + this._prevState);
            this.$el.addClass("js-button-view-" + this._state);
            this._prevState = this._state;
        },

        _onTapStart: function() {
            this._state = "down";
            this.invalidate("state");
        },

        _onTapEnd: function() {
            this._state = "up";
            this.invalidate("state");
        }
    });

    return ButtonView;

});