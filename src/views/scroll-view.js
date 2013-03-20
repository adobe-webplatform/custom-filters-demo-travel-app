define(["mobileui/views/gesture-view",
        "mobileui/views/gesture-detector",
        "mobileui/utils/boilerplate"], function(GestureView, GestureDetector, boilerplate) {

    var ScrollView = GestureView.extend({

        initialize: function() {
            ScrollView.__super__.initialize.call(this);
            this.on("touchdragstart", this._onTouchDragStart, this);
            this.on("touchdragmove", this._onTouchDragMove, this);
            this.on("touchdragend", this._onTouchDragEnd, this);
            this._contentView = null;
            this._scrollLeft = 0;
            this._scrollTop = 0;
            this._touchStartState = null;
            this._canOverScroll = false;
            this._scrollDirection = ScrollView.BOTH;
        },

        render: function() {
            this.$el
                .addClass("js-scroll-view")
                .on("mousewheel", this._onMouseWheel.bind(this));
            return ScrollView.__super__.render.call(this);
        },

        setScrollDirection: function(direction) {
            this._scrollDirection = direction;
            return this;
        },

        layout: function() {
            ScrollView.__super__.layout.call(this);
            this.invalidate("scroll");
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
            if (!this._canOverScroll || this._scrollDirection == ScrollView.VERTICAL)
                this._scrollLeft = Math.max(0, Math.min(this._scrollLeft, this.maxScrollLeft()));
            if (!this._canOverScroll || this._scrollDirection == ScrollView.HORIZONTAL)
                this._scrollTop = Math.max(0, Math.min(this._scrollTop, this.maxScrollTop()));
            var scrollOptions = {
                left: this._scrollLeft,
                top: this._scrollTop
            };
            if (this._contentView.getLayout) {
                var contentViewLayout = this._contentView.getLayout();
                if (contentViewLayout && contentViewLayout.scroll) {
                    contentViewLayout.scroll(this, scrollOptions);
                    return;
                }
            }
            this._internalScroll(this, scrollOptions);
        },

        _internalScroll: function(scrollView, options) {
            var contentView = scrollView.contentView();
            contentView
                .transform()
                .get("translate")
                .setX(-options.left).setY(-options.top);
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
            this._canOverScroll = true;
        },

        _onTouchDragMove: function(transform) {
            if (!this._touchStartState)
                return;
            this.scrollTo(this._touchStartState.scrollLeft - transform.dragX,
                    this._touchStartState.scrollTop - transform.dragY);
        },

        _onTouchDragEnd: function(transform) {
            this._canOverScroll = false;
            this.invalidate("scroll");
            this._touchStartState = null;
        }
    }, {
        BOTH: "both",
        VERTICAL: "vertical",
        HORIZONTAL: "horizontal"
    });

    return ScrollView;

});