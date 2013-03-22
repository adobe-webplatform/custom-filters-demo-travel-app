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

define(["mobileui/utils/time"], function(Time) {

    function computeDirection(x) { return x >= 0 ? 1 : -1; }

    var Momentum = function(duration) {
        this._duration = duration;
        this._friction = 0.005;
        this.reset(0);
    };

    _.extend(Momentum.prototype, Backbone.Events, {
        setDuration: function(duration) {
            this._duration = duration;
            return this;
        },

        setFriction: function(friction) {
            this._friction = friction;
            return this;
        },

        reset: function(startValue) {
            this._currentValue = startValue;
            this._direction = 0;
            this._internalResetGesture();
        },

        computeDelta: function() {
            var time = Time.now(),
                duration = time - this._startTime;
            if (!duration)
                return 0;
            var velocity = (this._currentValue - this._startValue) / duration;
            return Math.max(0, velocity * velocity * this._duration - this._friction * this._duration * this._duration) * computeDirection(velocity);
        },

        compute: function() {
            var delta = this.computeDelta();
            return this._currentValue + delta;
        },

        _internalResetGesture: function() {
            this._startValue = this._currentValue;
            this._startTime = Time.now();
        },

        injectValue: function(value) {
            if (this._currentValue == value)
                return;
            var direction = computeDirection(this._currentValue - value);
            if (this._direction != direction) {
                if (this._direction)
                    this._internalResetGesture();
                this._direction = direction;
            }
            this._currentValue = value;
        },

        direction: function() {
            return this._direction;
        }
    });

    return Momentum;

});