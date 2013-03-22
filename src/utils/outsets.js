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

define(function() {

    var Outsets = function() {
        this._left = 0;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
    };

    Outsets.prototype = _.extend({}, Backbone.Events, {
        
        left: function() { return this._left; },
        top: function() { return this._top; },
        right: function() { return this._right; },
        bottom: function() { return this._bottom; },

        horizontal: function() { return this._left + this._right; },
        vertical: function() { return this._top + this._bottom; },

        setLeft: function(left) { this._left = left; this._changedHorizontal(); return this; },
        setRight: function(right) { this._right = right; this._changedHorizontal(); return this; },

        setTop: function(top) { this._top = top; this._changedVertical(); return this; },
        setBottom: function(bottom) { this._bottom = bottom; this._changedVertical(); return this; },

        setAll: function(value) {
            var verticalChanged =
                this._left != value ||
                this._right != value;
            var horizontalChanged =
                this._top != value ||
                this._bottom != value;
            if (!verticalChanged && !horizontalChanged)
                return;
            this._left = value;
            this._right = value;
            this._top = value;
            this._bottom = value;

            if (verticalChanged)
                this.trigger("change:vertical");
            if (horizontalChanged)
                this.trigger("change:horizontal");
            this.trigger("change");
            return this;
        },

        set: function(other) {
            var verticalChanged =
                this._left != other.left() ||
                this._right != other.right();
            var horizontalChanged =
                this._top != other.top() ||
                this._bottom != other.bottom();
            if (!verticalChanged && !horizontalChanged)
                return;
            this._left = bounds.left();
            this._right = bounds.right();
            this._top = bounds.top();
            this._bottom = bounds.bottom();

            if (verticalChanged)
                this.trigger("change:vertical");
            if (horizontalChanged)
                this.trigger("change:horizontal");
            this.trigger("change");
            return this;
        },

        toCSSString: function(units) {
            return [
                this._top + units,
                this._right + units,
                this._bottom + units,
                this._left + units
            ].join(" ");
        },

        _changedHorizontal: function() {
            this.trigger("change:horizontal");
            this.trigger("change");
        },

        _changedVertical: function() {
            this.trigger("change:vertical");
            this.trigger("change");
        }

    });

    return Outsets;
});