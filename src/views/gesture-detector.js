define(["mobileui/views/touch-manager"],
    function(TouchManager) {

    function dist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function angle(x1, y1, x2, y2) {
        var cos = (x1 * x2 + y1 * y2) / (dist(0, 0, x1, y1) * dist(0, 0, x2, y2));
        return Math.acos(cos) * 180 / Math.PI;
    }

    function rotation(x1, y1, x2, y2) {
        var angle1 = angle(1, 0, x1, y1);
        var angle2 = angle(1, 0, x2, y2);
        if (y1 > 0)
            angle1 = - angle1;
        if (y2 > 0)
            angle2 = - angle2;
        return angle1 - angle2;
    }

    function GestureType(type, scrollX, scrollY) {
        this.type = type;
        this.scrollX = scrollX;
        this.scrollY = scrollY;
    }

    GestureType.DRAG = "drag";
    GestureType.TRANSFORM = "transform";

    /*
    Gesture types detected:
    1. Tap
    2. Long-tap
    3. Drag - Swipe
    4. Transform (move, scale, rotate)
    */
    function GestureDetector(view) {
        this.touchesStarted = 0;
        this.didStartDragging = false;
        this.didStartTransform = false;
        this.canTap = true;
        this.longTapDuration = 500;
        this.minDragLength = 10;
        this.longTapTimer = null;
        this.longTapTimerCallback = this.onLongTapTimer.bind(this);
        this.longTapTouch = null;
        this.touchParent = null;
        this.dragSurface = null;
        this.draggingTouch = null;
        this.view = null;
        if (view)
            this.install(view);
    }

    _.extend(GestureDetector.prototype, Backbone.Events, {

        install: function(view) {
            this.view = view.setNeedsTouchEvents(true);
            view.on("touchstart", this.onGestureTouchStart.bind(this));
            view.on("touchmove", this.onGestureTouchMove.bind(this));
            view.on("touchend", this.onGestureTouchEnd.bind(this));
            view.on("touchcanceled", this.onGestureTouchCanceled.bind(this));
        },

        installGestureTimers: function(touch) {
            this.clearGestureTimers();
            this.longTapTouch = touch;
            this.longTapTimer = setTimeout(this.longTapTimerCallback, this.longTapDuration);
        },

        clearGestureTimers: function() {
            if (!this.longTapTimer)
                return;
            this.longTapTouch = null;
            clearTimeout(this.longTapTimer);
            this.longTapTimer = null;
        },

        installTransformCapture: function() {
            var parentTransformSurface = this.findParentTouchSurface(new GestureType(GestureType.TRANSFORM));
            if (parentTransformSurface && !parentTransformSurface.noTouchCapture)
                TouchManager.instance.captureTouchSurface = this.view;
        },

        clearTransformCapture: function() {
            if (TouchManager.instance.captureTouchSurface === this.view)
                TouchManager.instance.captureTouchSurface = null;
        },

        computeGestureTransform: function() {
            var pointA = this.view.touchPoints[0];
            var pointB = this.view.touchPoints[1];

            var originX = (pointA.startPosition.localX + pointB.startPosition.localX) / 2;
            var originY = (pointA.startPosition.localY + pointB.startPosition.localY) / 2;

            var centerStartX = (pointA.startPosition.parentX + pointB.startPosition.parentX) / 2;
            var centerStartY = (pointA.startPosition.parentY + pointB.startPosition.parentY) / 2;
            var distanceStart = dist(pointA.startPosition.parentX, pointA.startPosition.parentY, pointB.startPosition.parentX, pointB.startPosition.parentY);

            var centerEndX = (pointA.currentPosition.parentX + pointB.currentPosition.parentX) / 2;
            var centerEndY = (pointA.currentPosition.parentY + pointB.currentPosition.parentY) / 2;
            var distanceEnd = dist(pointA.currentPosition.parentX, pointA.currentPosition.parentY, pointB.currentPosition.parentX, pointB.currentPosition.parentY);

            var vectorRotation = rotation(
                    pointB.startPosition.parentX - pointA.startPosition.parentX,
                    pointB.startPosition.parentY - pointA.startPosition.parentY,
                    pointB.currentPosition.parentX - pointA.currentPosition.parentX,
                    pointB.currentPosition.parentY - pointA.currentPosition.parentY
                );

            return {
                scale: (distanceStart > 0) ? (distanceEnd / distanceStart) : 0,
                dragX: centerEndX - centerStartX,
                dragY: centerEndY - centerStartY,
                originX: originX,
                originY: originY,
                rotation: vectorRotation
            };
        },

        computeDragTransform: function(touch) {
            return {
                dragX: touch.currentPosition.parentX - touch.startPosition.parentX,
                dragY: touch.currentPosition.parentY - touch.startPosition.parentY
            };
        },

        onGestureTouchStart: function(touch) {
            this.touchesStarted = (this.view.touchPoints.length == 1) ? 1 : (this.touchesStarted + 1);
            if (this.touchesStarted == 1) {
                this.installGestureTimers(touch);
                this.installTransformCapture();
                this.view.trigger("tapstart", touch);
            } else if (!this.didStartTransform) {
                // Two finger gesture.
                if (this.didStartDragging) {
                    var oldDragTouch = this.view.touchPoints[0];
                    this.dragSurface.trigger("touchdragend", this.computeDragTransform(oldDragTouch), oldDragTouch, false);
                    this.dragSurface = null;
                    this.didStartDragging = false;
                    oldDragTouch.startPosition = oldDragTouch.currentPosition;
                } else {
                    this.canTap = false;
                    this.view.trigger("tapend", touch);
                }
                this.clearGestureTimers();
                this.dragSurface = this.findParentTouchSurface(new GestureType(GestureType.TRANSFORM));
                if (this.dragSurface) {
                    this.didStartTransform = true;
                    this.view.touchPoints[0].attachToSurface(this.dragSurface);
                    this.view.touchPoints[1].attachToSurface(this.dragSurface);
                    this.dragSurface.trigger("touchtransformstart", touch);
                    this.clearTransformCapture();
                }
            }
        },

        cancelTransform: function() {
            if (!this.didStartTransform)
                return;
            this.didStartTransform = false;
            this.dragSurface = null;
        },

        onGestureTouchMove: function(touch) {
            if (this.didStartTransform) {
                // Interpret the tranform out of the first two touches.
                this.dragSurface.trigger("touchtransform", this.computeGestureTransform());
                return;
            }
            if (!this.didStartDragging && this.touchesStarted == 1) {
                var distanceX = Math.abs(touch.startPosition.pageX - touch.currentPosition.pageX);
                var distanceY = Math.abs(touch.startPosition.pageY - touch.currentPosition.pageY);
                if (distanceX > distanceY)
                    distanceY = 0;
                else
                    distanceX = 0;
                var scrollX = distanceX > this.minDragLength;
                var scrollY = distanceY > this.minDragLength;
                if (scrollX || scrollY) {
                    this.canTap = false;
                    this.view.trigger("tapend", touch);
                    this.clearGestureTimers();
                    this.dragSurface = this.findParentTouchSurface(new GestureType(GestureType.DRAG, scrollX, scrollY));
                    if (this.dragSurface) {
                        touch.attachToSurface(this.dragSurface);
                        touch.dragStartTime = touch.currentPosition.time - touch.startPosition.time;
                        this.didStartDragging = true;
                        this.dragSurface.draggingTouch = touch;
                        this.dragSurface.trigger("touchdragstart", touch);
                    }
                }
            }
            if (this.didStartDragging && touch === this.dragSurface.draggingTouch)
                this.dragSurface.trigger("touchdragmove", this.computeDragTransform(touch), touch);
        },

        startDraggingFromLongTap: function() {
            var touch = this.view.touchPoints[0];
            if (!touch)
                return;
            this.canTap = false;
            this.view.trigger("tapend", touch);
            this.clearGestureTimers();
            this.dragSurface = this;
            this.didStartDragging = true;
            touch.attachToSurface(this.dragSurface);
            touch.dragStartTime = touch.currentPosition.time - touch.startPosition.time;
            this.dragSurface.draggingTouch = touch;
            this.dragSurface.trigger("touchdragstart", touch);
        },

        onLongTapTimer: function() {
            this.clearGestureTimers();
            this.view.trigger("longtaptimer", this.longTapTouch);
            if (!this.view.$el.parent().length)
                this.clearTransformCapture();
        },

        onGestureTouchEnd: function(touch) {
            this.clearGestureTimers();
            if (this.didStartTransform) {
                if (this.view.touchPoints.length == 1) {
                    this.dragSurface.trigger("touchtransformend", touch);
                    // One touch remaining, go back to dragging.
                    this.didStartTransform = false;
                    this.didStartDragging = false;
                    this.dragSurface = null;
                    this.installTransformCapture();
                }
            } else if (this.canTap) {
                this.view.trigger("tapend", touch);
                // We only had one touch during this interval. Figure out if it's a tap or
                // a long-tap and fire the event.
                var touchDuration = touch.currentPosition.time - touch.startPosition.time;
                this.view.trigger((touchDuration < this.longTapDuration) ? "tap" : "longtap", touch);
            }
            if (!this.view.touchPoints.length) {
                if (this.didStartDragging)
                    this.dragSurface.trigger("touchdragend", this.computeDragTransform(touch), touch, true);
                else if (this.didStartTransform)
                    this.dragSurface.trigger("touchtransformend", touch);
                this.finishGesture(touch);
            }
        },

        finishGesture: function(touch) {
            if (this.dragSurface) {
                this.dragSurface.draggingTouch = null;
                this.dragSurface.trigger("gestureend", touch);
                this.dragSurface = null;
            }
            this.didStartTransform = false;
            this.didStartDragging = false;
            this.touchesStarted = 0;
            this.canTap = true;
            this.clearTransformCapture();
        },

        onGestureTouchCanceled: function(touch) {
            this.onGestureTouchEnd(touch);
        },

        findParentTouchSurface: function(gesture) {
            for (var node = this.view; node; node = node.parent()) {
                if (node.respondsToTouchGesture && node.respondsToTouchGesture(gesture))
                    return node;
            }
            return null;
        }
    });

    GestureDetector.GestureType = GestureType;

    return GestureDetector;

});