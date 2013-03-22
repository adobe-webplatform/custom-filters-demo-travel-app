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

define(["mobileui/utils/basic-animation"], function(BasicAnimation) {

    var OpacityAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._arguments = 0;
        this._startOpacity = null;
    };

    _.extend(OpacityAnimation.prototype, BasicAnimation.prototype, {
        opacity: function() {
            return this._opacity;
        },

        setOpacity: function(opacity) {
            this._opacity = opacity;
            return this;
        },

        startOpacity: function() {
            return this._startOpacity;
        },

        setStartOpacity: function(opacity) {
            this._startOpacity = opacity;
            return this;
        },

        _internalStart: function(state, view, animationState) {
            animationState.startOpacity = view.opacity();
        },

        _internalCompute: function(state, view, animationState) {
            if (animationState.started)
                state.requestFrame();
            var opacity;
            if (this._startOpacity !== null)
                opacity = this._startOpacity * (1 - animationState.timingFunctionPercent) +
                    animationState.timingFunctionPercent * this._opacity;
            else
                opacity = animationState.startOpacity * (1 - animationState.timingFunctionPercent) +
                    animationState.timingFunctionPercent * this._opacity;
            view.setOpacity(opacity);
        }
    });

    return OpacityAnimation;

});