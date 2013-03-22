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

define(["mobileui/utils/animation-controller",
        "mobileui/utils/animation",
        // Initialize all types of animations here.
        "mobileui/utils/transform-animation",
        "mobileui/utils/opacity-animation",
        "mobileui/utils/filter-animation"
        ], function(AnimationController, Animation) {

    var AnimationSet = function(view) {
        Animation.call(this, "animationSet");
        this._view = view;
    };

    _.extend(AnimationSet.prototype, Animation.prototype, {
        start: function() {
            if (AnimationController.instance.register(this))
                this.trigger("start");
            return this;
        },

        inlineStart: function() {
            this.start();
            AnimationController.instance.runOnRequestAnimationFrame();
            return this;
        },

        stop: function() {
            if (AnimationController.instance.unregister(this))
                this.trigger("stop");
            return this;
        },

        compute: function(state) {
            state.prepareSet();
            Animation.prototype.compute.call(this, state, this._view);
            if (!state.isSetActive())
                this.stop();
        }
    });

    return AnimationSet;

});