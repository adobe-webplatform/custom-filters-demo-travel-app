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

    var LayoutParams = function() {
        this._width = null;
        this._height = null;
        this._weight = 1;
        this._isPostioned = false;
    };

    _.extend(LayoutParams.prototype, {

        setIsPositioned: function(positioned) {
            this._isPostioned = positioned;
            return this;
        },

        isPositioned: function() {
            return this._isPostioned;
        },

        width: function() {
            return this._width;
        },

        setWidth: function(width) {
            this._width = width;
            return this;
        },

        fillParentWidth: function() {
            return this.setWidth(LayoutParams.FILL_PARENT);
        },

        matchParentWidth: function() {
            return this.setWidth(LayoutParams.MATCH_PARENT);
        },

        matchChildrenWidth: function() {
            return this.setWidth(LayoutParams.MATCH_CHILDREN);
        },

        matchWidthOf: function(parentView) {
            return this.setWidth(parentView);
        },

        height: function() {
            return this._height;
        },

        setHeight: function(height) {
            this._height = height;
            return this;
        },

        fillParentHeight: function() {
            return this.setHeight(LayoutParams.FILL_PARENT);
        },

        matchParentHeight: function() {
            return this.setHeight(LayoutParams.MATCH_PARENT);
        },

        matchChildrenHeight: function() {
            return this.setHeight(LayoutParams.MATCH_CHILDREN);
        },

        matchHeightOf: function(parentView) {
            return this.setHeight(parentView);
        },

        matchParent: function() {
            return this
                .setWidth(LayoutParams.MATCH_PARENT)
                .setHeight(LayoutParams.MATCH_PARENT);
        },

        fillParent: function() {
            return this
                .setWidth(LayoutParams.FILL_PARENT)
                .setHeight(LayoutParams.FILL_PARENT);
        },

        matchChildren: function() {
            return this
                .setWidth(LayoutParams.MATCH_CHILDREN)
                .setHeight(LayoutParams.MATCH_CHILDREN);
        },

        weight: function() {
            return this._weight;
        },

        setWeight: function(weight) {
            this._weight = weight;
            return this;
        },

        hasParentDerivedWidth: function() {
            return this._width == LayoutParams.MATCH_PARENT ||
                this._width == LayoutParams.FILL_PARENT ||
                _.isNumber(this._width);
        },

        hasParentDerivedHeight: function() {
            return this._height == LayoutParams.MATCH_PARENT ||
                this._height == LayoutParams.FILL_PARENT ||
                _.isNumber(this._height);
        }

    });

    _.extend(LayoutParams, {
        FILL_PARENT: "fill-parent",
        MATCH_PARENT: "match-parent",
        MATCH_CHILDREN: "match-children"
    });

    return LayoutParams;

});