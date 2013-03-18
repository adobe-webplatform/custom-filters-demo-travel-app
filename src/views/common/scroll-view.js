define(["mobileui/views/common/touch-view", 
        "mobileui/views/common/gesture-detector",
        "mobileui/utils/boilerplate"], function(TouchView, GestureDetector, boilerplate) {

    var ScrollView = TouchView.extend({

        initialize: function() {
            ScrollView.__super__.initialize.call(this);
            this.on("touchdragstart", this._onTouchDragStart, this);
            this.on("touchdragmove", this._onTouchDragMove, this);
            this.on("touchdragend", this._onTouchDragEnd, this);
            this._gestureDetector = new GestureDetector(this);
            this._contentView = null;
            this._scrollLeft = 0;
            this._scrollTop = 0;
            this._touchStartState = null;
        },

        render: function() {
            this.$el
                .addClass("js-scroll-view")
                .on("mousewheel", this._onMouseWheel.bind(this));
            return ScrollView.__super__.render.call(this);
        },

        setContentView: function(view) {
            if (this._contentView === view)
                return;
            if (this._contentView) {
                this._contentView.remove();
                this._contentView = null;
            }
            if (view) {
                this._contentView = view;
                this.append(view);
            }
            return this;
        },

        contentView: function() {
            return this._contentView;
        },

        scrollTo: function(left, top) {
            if (!this._contentView)
                return;
            if (this._scrollLeft == left && 
                this._scrollTop == top)
                return;
            this._scrollLeft = left;
            this._scrollTop = top;
            this.invalidate("scroll");
        },

        scrollBy: function(left, top) {
            if (!this._contentView || (!left && !top))
                return;
            this._scrollLeft += left;
            this._scrollTop += top;
            this.invalidate("scroll");
        },

        scrollWidth: function() {
            return this._contentView ? this._contentView.bounds().width() : 0;
        },

        scrollHeight: function() {
            return this._contentView ? this._contentView.bounds().height() : 0;
        },

        maxScrollLeft: function() {
            return Math.max(0, this._contentView.outerWidth() - this.bounds().width());
        },

        maxScrollTop: function() {
            return Math.max(0, this._contentView.outerHeight() - this.bounds().height());
        },

        _validateScroll: function() {
            if (!this._contentView)
                return;
            this._scrollLeft = Math.max(0, Math.min(this._scrollLeft, this.maxScrollLeft()));
            this._scrollTop = Math.max(0, Math.min(this._scrollTop, this.maxScrollTop()));
            var contentViewLayout = this._contentView.getLayout();
            if (!contentViewLayout || !contentViewLayout.scroll) {
                console.log("Scroll not supported with selected layout type.");
                return;
            }
            contentViewLayout.scroll(this, {
                left: this._scrollLeft,
                top: this._scrollTop
            });
        },

        _onMouseWheel: function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            var ev = event.originalEvent,
                left = 0, top = ev.wheelDelta;
            if (ev.hasOwnProperty("wheelDeltaX")) {
                left = ev.wheelDeltaX;
                top = ev.wheelDeltaY;
            }
            if (boilerplate.lookupPrefix(ev, "directionInvertedFromDevice")) {
                left *= -1;
                top *= -1;
            }
            this.scrollBy(left, top);
        },

        respondsToTouchGesture: function(touch) {
            if (!this._contentView || touch.type != GestureDetector.GestureType.DRAG)
                return false;
            return true;
        },

        _onTouchDragStart: function() {
            this._touchStartState = {
                scrollLeft: this._scrollLeft,
                scrollTop: this._scrollTop
            };
        },

        _onTouchDragMove: function(transform) {
            if (!this._touchStartState)
                return;
            this.scrollTo(this._touchStartState.scrollLeft - transform.dragX,
                    this._touchStartState.scrollTop - transform.dragY);
        },

        _onTouchDragEnd: function(transform) {
            this._touchStartState = null;
        }
    });

    return ScrollView;

});