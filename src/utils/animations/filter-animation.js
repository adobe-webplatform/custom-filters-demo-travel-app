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

define(["mobileui/utils/animations/basic-animation",
        "mobileui/utils/transform",
        "mobileui/utils/filter"], function(BasicAnimation, Transform, Filter) {

    var FilterAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._filter = new Filter();
        this._startFilter = null;
    };

    _.extend(FilterAnimation.prototype, BasicAnimation.prototype, {
        getFilter: function() {
            return this._filter;
        },

        startFilter: function() {
            if (!this._startFilter)
                this._startFilter = new Transform();
            return this._startFilter;
        },

        _internalStart: function(state, view, animationState) {
            animationState.startFilter = view.filter().clone();
        },

        _internalCompute: function(state, view, animationState) {
            if (animationState.started)
                state.requestFrame();
            var filter;
            if (this._startFilter)
                filter = this._startFilter.blend(animationState.timingFunctionPercent, this._filter);
            else
                filter = animationState.startFilter.blend(animationState.timingFunctionPercent, this._filter);
            view.filter().take(filter);
        }
    });

    return FilterAnimation;

});