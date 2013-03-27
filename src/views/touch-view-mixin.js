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

define([
    "mobileui/views/touch",
    "mobileui/views/touch-manager"], function(Touch, TouchManager) {

    var TouchViewMixin = {
        initializeTouchViewMixin: function() {
            this.touchEvents = {
                installed: false,
                onTouchStart: this.onTouchStart.bind(this),
                onMouseDown: this.onMouseDown.bind(this),
                onClick: this.onClick.bind(this)
            };
            this.touchPointsSet = {};
            this.touchPoints = [];
            return this;
        },

        installTouchEvents: function() {
            if (this.touchEvents.installed)
                return;
            var el = this.$el.get(0);
            el.addEventListener("touchstart", this.touchEvents.onTouchStart, false);
            el.addEventListener("mousedown", this.touchEvents.onMouseDown, false);
            el.addEventListener("click", this.touchEvents.onClick, false);
        },

        removeTouchEvents: function() {
            if (!this.touchEvents.installed)
                return;
            var el = this.$el.get(0);
            el.removeEventListener("touchstart", this.touchEvents.onTouchStart, false);
            el.removeEventListener("mousedown", this.touchEvents.onMouseDown, false);
            el.removeEventListener("click", this.touchEvents.onClick, false);
        },

        removeTouch: function(touch) {
            this.touchPointsSet[touch.identifier] = null;
            var index = this.touchPoints.indexOf(touch);
            if (index != -1)
                this.touchPoints.splice(index, 1);
        },

        setTouch: function(touch) {
            this.touchPointsSet[touch.identifier] = touch;
            this.touchPoints.push(touch);
        },

        onTouchStartInternal: function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; ++i) {
                var touch = touches[i];
                var internalTouch = TouchManager.instance.findTouch(touch.identifier);
                if (!internalTouch)
                    internalTouch = TouchManager.instance.handleTouchStart(touches[i]);
                internalTouch.view = this;
                this.setTouch(internalTouch);
                this.trigger("touchstart", internalTouch);
            }
        },

        onTouchStart: function(event) {
            if (TouchManager.instance.needsNativeTouch(event) || this.disabled())
                return;
            this.onTouchStartInternal(event);
            this.inlineUpdate();
        },

        onMouseDown: function(event) {
            if (TouchManager.instance.needsNativeTouch(event) || this.disabled())
                return;
            event.preventDefault();
            event.stopImmediatePropagation();

            var internalTouch = TouchManager.instance.findTouch(Touch.MOUSE);
            if (!internalTouch)
                internalTouch = TouchManager.instance.handleMouseDown(event);
            internalTouch.view = this;
            this.setTouch(internalTouch);
            this.trigger("touchstart", internalTouch);
            this.inlineUpdate();
        },

        onClick: function(event) {
            if (TouchManager.instance.needsNativeTouch(event) || this.disabled())
                return;
            event.preventDefault();
            event.stopImmediatePropagation();
            this.inlineUpdate();
        }
    };

    return TouchViewMixin;
});