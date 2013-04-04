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

define(["mobileui/utils/animations/animation", "require",
        "mobileui/utils/animations/timing-functions"], function(Animation, require, TimingFunctions) {

    var BasicAnimationState = function(time) {
        this.startTime = time;
        this.playDuration = 0;
        this.percent = 0;
        this.started = true;
    };

    var BasicAnimation = function(name) {
        Animation.call(this, name);
        this._duration = -1;
        this._next = null;
        this._timingFunction = TimingFunctions.linear;
    };

    _.extend(BasicAnimation.prototype, Backbone.Events, {
        compute: function(state, view) {
            var animationState = state.get(this._id);
            if (!animationState) {
                animationState = new BasicAnimationState(state.time);
                state.set(this._id, animationState);
                this._internalStart(state, view, animationState);
                this.trigger("start");
            }
            animationState.playDuration = state.time - animationState.startTime;
            if (this._duration >= 0) {
                animationState.percent = this._duration ? animationState.playDuration / this._duration : 1;
                if (animationState.percent >= 1) {
                    animationState.timingFunctionPercent = 1;
                    animationState.percent = 1;
                    state.remove(this._id);
                    animationState.started = false;
                } else {
                    animationState.timingFunctionPercent = this._timingFunction(animationState.percent, this._duration);
                }
            }
            this._internalCompute(state, view, animationState);
            if (!animationState.started)
                this.trigger("stop");
        },

        setTimingFunction: function(value) {
            if (_.isString(value))
                value = TimingFunctions[value];
            this._timingFunction = value;
            return this;
        },

        _internalStart: function(state, view, animationState) {
        },

        _internalCompute: function(state, view, animationState) {
            if (animationState.started)
                state.requestTimer(this._duration - animationState.playDuration);
        },

        setDuration: function(duration) {
            this._duration = duration;
            return this;
        },

        duration: function() {
            return this._duration;
        },

        setNext: function(nextAnimation) {
            this._next = nextAnimation;
            return this;
        },

        next: function() {
            return this._next;
        },

        wait: function(duration) {
            return this.setNext(new BasicAnimation("wait " + duration).setDuration(duration)).next();
        },

        log: function(message) {
            return this.setNext(new BasicAnimation("log " + message).setDuration(0).on("stop", function() {
                console.log("animation: ", message);
            })).next();
        },

        callback: function(callback, context) {
            return this.setNext(new BasicAnimation("callback").setDuration(0).on("stop", callback, context)).next();
        },

        promise: function() {
            var deferred = $.Deferred();
            this.setNext(new BasicAnimation("promise").setDuration(0).on("stop", function() {
                deferred.resolveWith(this);
            }, this));
            return deferred.promise();
        },

        transform: function(duration, startTransform, endTransform) {
            if (!endTransform) {
                endTransform = startTransform;
                startTransform = null;
            }
            var TransformAnimation = require("mobileui/utils/animations/transform-animation");
            var transformAnimation = new TransformAnimation("transform");
            transformAnimation.getTransform().take(endTransform);
            if (startTransform)
                transformAnimation.startTransform().take(startTransform);
            return this.setNext(transformAnimation.setDuration(duration)).next();
        },

        filter: function(duration, startFilter, endFilter) {
            if (!endFilter) {
                endFilter = startFilter;
                startFilter = null;
            }
            var FilterAnimation = require("mobileui/utils/animations/filter-animation");
            var filterAnimation = new FilterAnimation("filter");
            filterAnimation.getFilter().take(endFilter);
            if (startFilter)
                filterAnimation.startFilter().take(startFilter);
            return this.setNext(filterAnimation.setDuration(duration)).next();
        },

        opacity: function(duration, startOpacity, endOpacity) {
            if (endOpacity === undefined) {
                endOpacity = startOpacity;
                startOpacity = null;
            }
            var OpacityAnimation = require("mobileui/utils/animations/opacity-animation");
            var opacityAnimation = new OpacityAnimation("opacity");
            opacityAnimation.setOpacity(endOpacity);
            if (startOpacity !== null)
                opacityAnimation.setStartOpacity(startOpacity);
            return this.setNext(opacityAnimation.setDuration(duration)).next();
        }
    });

    return BasicAnimation;
});