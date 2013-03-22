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

define(["mobileui/utils/basic-animation",
        "mobileui/utils/transform"], function(BasicAnimation, Transform) {
    
    var TransformAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._transform = new Transform();
        this._startTransform = null;
    };

    _.extend(TransformAnimation.prototype, BasicAnimation.prototype, {
        getTransform: function() {
            return this._transform;
        },

        startTransform: function() {
            if (!this._startTransform)
                this._startTransform = new Transform();
            return this._startTransform;
        },

        _internalStart: function(state, view, animationState) {
            animationState.startTransform = view.transform().clone();
        },

        _internalCompute: function(state, view, animationState) {
            if (animationState.started)
                state.requestFrame();
            var transform;
            if (this._startTransform)
                transform = this._startTransform.blend(animationState.timingFunctionPercent, this._transform);
            else
                transform = animationState.startTransform.blend(animationState.timingFunctionPercent, this._transform);
            view.transform().take(transform);
        }
    });

    return TransformAnimation;

});