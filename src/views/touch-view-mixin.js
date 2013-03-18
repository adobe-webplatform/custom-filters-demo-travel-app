define([
    "mobileui/views/touch",
    "mobileui/views/touch-manager"], function(Touch, TouchManager) {

    var TouchViewMixin = {
        initializeTouchViewMixin: function() {
            this.touchEvents = {
                onTouchStart: this.onTouchStart.bind(this),
                onMouseDown: this.onMouseDown.bind(this),
                onClick: this.onClick.bind(this)
            };
            this.touchPointsSet = {};
            this.touchPoints = [];
        },

        renderTouchViewMixin: function() {
            this.installTouchEvents();
        },

        installTouchEvents: function() {
            this.$el
                .bind("touchstart", this.touchEvents.onTouchStart)
                .bind("mousedown", this.touchEvents.onMouseDown)
                .bind("click", this.touchEvents.onClick);
        },

        removeTouchEvents: function() {
            this.$el
                .unbind("touchstart", this.touchEvents.onTouchStart)
                .unbind("mousedown", this.touchEvents.onMouseDown)
                .unbind("click", this.touchEvents.onClick);
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
                if (!internalTouch) {
                    console.log("Current view could not attach to touch event.", touch, this);
                    continue;
                }
                internalTouch.view = this;
                this.setTouch(internalTouch);
                this.trigger("touchstart", internalTouch);
            }
        },

        onTouchStart: function(event) {
            if (TouchManager.instance.needsNativeTouch(event))
                return;
            this.onTouchStartInternal(event.originalEvent);
        },

        onMouseDown: function(event) {
            if (TouchManager.instance.needsNativeTouch(event))
                return;
            event.preventDefault();
            event.stopImmediatePropagation();

            var internalTouch = TouchManager.instance.findTouch(Touch.MOUSE);
            if (!internalTouch) {
                console.log("Current view could not attach to mouse event.", event, this);
                return;
            }
            internalTouch.view = this;
            this.setTouch(internalTouch);
            this.trigger("touchstart", internalTouch);
        },

        onClick: function(event) {
            if ($(event.target).attr("data-native-touch") !== undefined)
                return;
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    return TouchViewMixin;
});