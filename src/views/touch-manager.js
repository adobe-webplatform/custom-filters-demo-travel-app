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

define(["mobileui/views/touch",
        "mobileui/utils/request-animation-frame"], function(Touch, requestAnimationFrame) {

    function TouchManager() {
        this.touchEvents = {
           onTouchStart: this.onTouchStart.bind(this),
           onTouchMove: this.onTouchMove.bind(this),
           onTouchEnd: this.onTouchEnd.bind(this),
           onTouchCancel: this.onTouchCancel.bind(this),
           onMouseMove: this.onMouseMove.bind(this),
           onMouseUp: this.onMouseUp.bind(this)
        };
        this.mouseEvent = null;
        this.touchPointsSet = {};
        this.touchPoints = [];
        this.touchEventsInstalled = false;
        this.mouseEventsInstalled = false;
        this.captureTouchSurface = null;
    }

    _.extend(TouchManager.prototype, Backbone.Events, {

        inlineUpdate: function() {
            requestAnimationFrame.runInlinesIfNeeded();
        },

        findTouch: function(identifier) {
            return this.touchPointsSet[identifier];
        },

        setTouch: function(touch) {
            this.touchPointsSet[touch.identifier] = touch;
            this.touchPoints.push(touch);
            this.installTouchTrackingEvents();
        },

        cancelTouch: function(identifier) {
            var touch = this.findTouch(identifier);
            if (!touch)
                return;
            if (touch.view) {
                touch.view.removeTouch(touch);
                touch.view.trigger("touchcanceled", touch);
            }
            this.removeTouch(touch);
            touch.state = Touch.CANCELED;
            touch.updatePreviewBox();
        },

        removeTouch: function(touch) {
            delete this.touchPointsSet[touch.identifier];
            var index = this.touchPoints.indexOf(touch);
            if (index != -1)
                this.touchPoints.splice(index, 1);
            if (touch.identifier == Touch.MOUSE)
                this.removeMouseTrackingEvents();
            else if (!this.touchPoints.length)
                this.removeTouchTrackingEvents();
        },

        installTouchTrackingEvents: function() {
            if (this.touchEventsInstalled)
                return;
            this.touchEventsInstalled = true;
            window.addEventListener("touchstart", this.touchEvents.onTouchStart, true);
            window.addEventListener("touchmove", this.touchEvents.onTouchMove, true);
            window.addEventListener("touchend", this.touchEvents.onTouchEnd, true);
            window.addEventListener("touchcancel", this.touchEvents.onTouchCancel, true);
        },

        removeTouchTrackingEvents: function() {
            if (!this.touchEventsInstalled)
                return;
            this.touchEventsInstalled = false;
            window.removeEventListener("touchstart", this.touchEvents.onTouchStart, true);
            window.removeEventListener("touchmove", this.touchEvents.onTouchMove, true);
            window.removeEventListener("touchend", this.touchEvents.onTouchEnd, true);
            window.removeEventListener("touchcancel", this.touchEvents.onTouchCancel, true);
        },

        installMouseTrackingEvents: function() {
            if (this.mouseEventsInstalled)
                return;
            this.mouseEventsInstalled = true;
            window.addEventListener("mousemove", this.touchEvents.onMouseMove, true);
            window.addEventListener("mouseup", this.touchEvents.onMouseUp, true);
        },

        removeMouseTrackingEvents: function() {
            if (!this.mouseEventsInstalled)
                return;
            this.mouseEventsInstalled = false;
            window.removeEventListener("mousemove", this.touchEvents.onMouseMove, true);
            window.removeEventListener("mouseup", this.touchEvents.onMouseUp, true);
        },

        needsNativeTouch: function(event) {
            var target = $(event.target);
            return (!this.captureTouchSurface &&
                (target.attr("data-native-touch") !== undefined ||
                target.prop("nodeName") === "A"));
        },

        removeFocus: function() {
            if (document.activeElement)
                $(document.activeElement).blur();
        },

        onTouchStart: function(event) {
            if (!this.captureTouchSurface)
                return;
            this.removeFocus();
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; ++i) {
                var touch = touches[i];
                if (this.findTouch(touches[i].identifier)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    continue;
                }
                var internalTouch = new Touch(touches[i].identifier);
                internalTouch.view = null;
                internalTouch.state = Touch.START;
                internalTouch.startPosition = internalTouch.currentPosition = Touch.getPosition(touch);
                internalTouch.updatePreviewBox();
                this.setTouch(internalTouch);
            }
            if (this.captureTouchSurface)
                this.captureTouchSurface.onTouchStartInternal(event);
            this.inlineUpdate();
        },

        handleTouchStart: function(touch) {
            var internalTouch = this.findTouch(touch.identifier);
            if (internalTouch)
                return internalTouch;
            internalTouch = new Touch(touch.identifier);
            internalTouch.view = null;
            internalTouch.state = Touch.START;
            internalTouch.startPosition = internalTouch.currentPosition = Touch.getPosition(touch);
            internalTouch.updatePreviewBox();
            this.setTouch(internalTouch);
            return internalTouch;
        },

        onTouchMove: function(event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; ++i) {
                var touch = touches[i];
                var internalTouch = this.findTouch(touch.identifier);
                if (!internalTouch) {
                    console.log("Unregister touch identifier detected for touchmove event", touch);
                    continue;
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                internalTouch.state = Touch.MOVE;
                internalTouch.update(Touch.getPosition(touch));
                if (internalTouch.view)
                    internalTouch.view.trigger("touchmove", internalTouch);
            }
            this.inlineUpdate();
        },

        onTouchEnd: function(event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; ++i) {
                var touch = touches[i];
                var internalTouch = this.findTouch(touch.identifier);
                if (!internalTouch) {
                    console.log("Unregister touch identifier detected for touchend event", touch);
                    continue;
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                internalTouch.state = Touch.END;
                internalTouch.update(Touch.getPosition(touch));
                this.removeTouch(internalTouch);
                if (internalTouch.view) {
                    internalTouch.view.removeTouch(internalTouch);
                    internalTouch.view.trigger("touchend", internalTouch);
                }
            }
            this.inlineUpdate();
        },

        onTouchCancel: function(event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; ++i) {
                var touch = touches[i];
                var internalTouch = this.findTouch(touch.identifier);
                if (!internalTouch) {
                    console.log("Unregister touch identifier detected for touchcanceled event", touch);
                    continue;
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                internalTouch.state = Touch.CANCELED;
                internalTouch.update(Touch.getPosition(touch));
                this.removeTouch(internalTouch);
                if (internalTouch.view) {
                    internalTouch.view.removeTouch(internalTouch);
                    internalTouch.view.trigger("touchcanceled", internalTouch);
                }
            }
            this.inlineUpdate();
        },

        internalTouchInvalidate: function(internalTouch) {
            internalTouch.state = Touch.CANCELED;
            this.removeTouch(internalTouch);
            internalTouch.updatePreviewBox();
            if (internalTouch.view) {
                internalTouch.view.removeTouch(internalTouch);
                internalTouch.view.trigger("touchcanceled", internalTouch);
            }
        },

        handleMouseDown: function(event) {
            this.cancelTouch(Touch.MOUSE);
            var internalTouch = new Touch(Touch.MOUSE);
            internalTouch.type = Touch.MOUSE;
            internalTouch.view = null;
            this.mouseEvent = internalTouch;
            this.setTouch(internalTouch);
            internalTouch.startPosition = internalTouch.currentPosition = Touch.getPosition(event);
            internalTouch.state = Touch.START;
            internalTouch.updatePreviewBox();
            this.installMouseTrackingEvents();
            return internalTouch;
        },

        onMouseMove: function(event) {
            var internalTouch = this.findTouch(Touch.MOUSE);
            if (!internalTouch) {
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            internalTouch.state = Touch.MOVE;
            internalTouch.update(Touch.getPosition(event));
            if (internalTouch.view)
                internalTouch.view.trigger("touchmove", internalTouch);
            this.inlineUpdate();
        },

        onMouseUp: function(event) {
            this.mouseEvent = null;
            var internalTouch = this.findTouch(Touch.MOUSE);
            if (!internalTouch) {
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            internalTouch.state = Touch.END;
            internalTouch.update(Touch.getPosition(event));
            this.removeTouch(internalTouch);
            if (internalTouch.view) {
                internalTouch.view.removeTouch(internalTouch);
                internalTouch.view.trigger("touchend", internalTouch);
            }
            this.inlineUpdate();
        }
    });

    TouchManager.instance = new TouchManager();

    return TouchManager;

});