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

define(["mobileui/utils/animation-controller"], function(AnimationController) {

    var Animation = function(name) {
        this._id = AnimationController.instance.allocateAnimationId();
        this.name = name;
        this._animations = [];
        this._stoppedAnimations = null;
    };

    _.extend(Animation.prototype, Backbone.Events, {
        compute: function(state, view) {
            _.each(this._animations, function(animation) {
                animation.compute(state, view);
            });
            if (this._stoppedAnimations) {
                var stoppedAnimations = this._stoppedAnimations;
                this._stoppedAnimations = null;
                var self = this;
                _.each(stoppedAnimations, function(animation) {
                    self._removeStoppedAnimation(animation, state);
                });
            }
        },

        search: function(name) {
            return _.find(this._animations, function(animation) { return animation.name == name; });
        },

        get: function(name) {
            var result = this.search(name);
            if (!result) {
                result = new Animation(name);
                this.append(result);
            }
            return result;
        },

        unset: function(name) {
            var result = this.search(name);
            if (result)
                this.remove(result);
        },

        _injectAnimation: function(animation) {
            animation.on("change:animation", this._onAnimationPropertyChange, this);
            animation.once("stop", this._onAnimationStopped.bind(this, animation));
            this._onAnimationPropertyChange();
        },

        append: function(animation) {
            this._animations.push(animation);
            this._injectAnimation(animation);
            return this;
        },

        insert: function(animation, i) {
            this._animations.splice(i, 0, animation);
            this._injectAnimation(animation);
            return this;
        },

        remove: function(animation) {
            var index = this._animations.indexOf(animation);
            if (index == -1)
                return;
            this._internalRemove(index);
            return this;
        },

        removeAll: function() {
            _.each(this._animations, function(animation) {
                animation.off("change:animation", this._onAnimationPropertyChange, this);
            });
            this._animations = [];
            return this;
        },

        _internalRemove: function(index) {
            var animation = this._animations[index];
            this._animations.splice(index, 1);
            animation.off("change:animation", this._onAnimationPropertyChange, this);
            this._onAnimationPropertyChange();
        },

        _onAnimationStopped: function(animation) {
            if (!this._stoppedAnimations)
                this._stoppedAnimations = [];
            this._stoppedAnimations.push(animation);
        },

        _removeStoppedAnimation: function(animation, state) {
            var index = this._animations.indexOf(animation);
            if (index == -1)
                return;
            this._internalRemove(index);
            var next = animation.next();
            if (!next)
                return;
            this.insert(next, index);
            state.requestImmediateFrame();
        },

        _onAnimationPropertyChange: function() {
            this.trigger("change:animation");
        },

        last: function() {
            return (this._animations.length) ? this._animations[this._animations.length - 1] : null;
        },

        chain: function(duration) {
            var BasicAnimation = require("mobileui/utils/basic-animation");
            var animation = new BasicAnimation("start").setDuration(duration !== undefined ? duration : 0);
            if (this._animations.length)
                this.last().setNext(animation);
            else
                this.append(animation);
            return animation;
        },

        promise: function() {
            var self = this,
                deferred = $.Deferred();
            this.once("stop", function() {
                deferred.resolveWith(self);
            });
            return deferred.promise();
        }
    });

    return Animation;

});