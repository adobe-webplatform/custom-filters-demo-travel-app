define(["mobileui/views/touch"], function(Touch) {

    function TouchManager() {
        this.touchEvents = {
           onTouchStart: this.onTouchStart.bind(this),
           onTouchMove: this.onTouchMove.bind(this),
           onTouchEnd: this.onTouchEnd.bind(this),
           onTouchCancel: this.onTouchCancel.bind(this),
           onMouseDown: this.onMouseDown.bind(this),
           onMouseMove: this.onMouseMove.bind(this),
           onMouseUp: this.onMouseUp.bind(this)
        };
        this.mouseEvent = null;
        this.touchPointsSet = {};
        this.touchPoints = [];
        this.touchEventsInstalled = false;
        this.mouseEventsInstalled = false;
        this.captureTouchSurface = null;

        this.installTouchTrackingEvents();
        this.installMouseTrackingEvents();
    }
    
    _.extend(TouchManager.prototype, Backbone.Events, {

        findTouch: function(identifier) {
            return this.touchPointsSet[identifier];
        },

        setTouch: function(touch) {
            this.touchPointsSet[touch.identifier] = touch;
            this.touchPoints.push(touch);
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
            this.touchPointsSet[touch.identifier] = null;
            var index = this.touchPoints.indexOf(touch);
            if (index != -1)
                this.touchPoints.splice(index, 1);
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
            window.addEventListener("mousedown", this.touchEvents.onMouseDown, true);
            window.addEventListener("mousemove", this.touchEvents.onMouseMove, true);
            window.addEventListener("mouseup", this.touchEvents.onMouseUp, true);
        },

        removeMouseTrackingEvents: function() {
            if (!this.mouseEventsInstalled)
                return;
            this.mouseEventsInstalled = false;
            window.removeEventListener("mousedown", this.touchEvents.onMouseDown, true);
            window.removeEventListener("mousemove", this.touchEvents.onMouseMove, true);
            window.removeEventListener("mouseup", this.touchEvents.onMouseUp, true);
        },

        needsNativeTouch: function(event) {
            return (!this.captureTouchSurface &&
                ($(event.target).attr("data-native-touch") !== undefined ||
                $(event.target).prop("nodeName") === "A"));
        },

        removeFocus: function() {
            if (document.activeElement)
                $(document.activeElement).blur();
        },

        onTouchStart: function(event) {
            if (this.needsNativeTouch(event))
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
        },

        onMouseDown: function(event) {
            if (this.needsNativeTouch(event))
                return;
            this.removeFocus();
            this.cancelTouch(Touch.MOUSE);
            var internalTouch = new Touch(Touch.MOUSE);
            internalTouch.type = Touch.MOUSE;
            internalTouch.view = null;
            this.mouseEvent = internalTouch;
            this.setTouch(internalTouch);
            internalTouch.startPosition = internalTouch.currentPosition = Touch.getPosition(event);
            internalTouch.state = Touch.START;
            internalTouch.updatePreviewBox();
            if (this.captureTouchSurface)
                this.captureTouchSurface.onMouseDown(event);
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
        }
    });

    TouchManager.instance = new TouchManager();

    return TouchManager;

});