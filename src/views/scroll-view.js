define(["mobileui/views/gesture-view",
        "mobileui/views/gesture-detector",
        "mobileui/utils/boilerplate",
        "mobileui/utils/momentum",
        "mobileui/utils/transform"],
function(GestureView, GestureDetector, boilerplate, Momentum,
            Transform) {

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
            this._scrollAnimationDuration = 300;
            this._momentumLeft = new Momentum(this._scrollAnimationDuration);
            this._momentumTop = new Momentum(this._scrollAnimationDuration);
            this._maxMomentum = 100;
            this._useAnimation = false;
        },

        render: function() {
            this.$el
                .addClass("js-scroll-view")
                .on("mousewheel", this._onMouseWheel.bind(this));
            return ScrollView.__super__.render.call(this);
        },

        setScrollAnimationDuration: function(duration) {
            this._scrollAnimationDuration = duration;
            this._momentumLeft.setDuration(duration);
            this._momentumTop.setDuration(duration);
            return this;
        },

        setScrollDirection: function(direction) {
            this._scrollDirection = direction;
            this.invalidate("scroll");
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

        _checkScrollPosition: function() {
            if (!this._canOverScroll || this._scrollDirection == ScrollView.VERTICAL)
                this._scrollLeft = Math.max(0, Math.min(this._scrollLeft, this.maxScrollLeft()));
            if (!this._canOverScroll || this._scrollDirection == ScrollView.HORIZONTAL)
                this._scrollTop = Math.max(0, Math.min(this._scrollTop, this.maxScrollTop()));
        },

        _validateScroll: function() {
            if (!this._contentView)
                return;
            if (this._useAnimation) {
                this._useAnimation = false;
                this._validateScrollWithAnimation();
                return;
            }
            this._checkScrollPosition();
            if (this._contentView.getLayout) {
                var contentViewLayout = this._contentView.getLayout();
                if (contentViewLayout && contentViewLayout.scroll) {
                    var scrollOptions = {
                        left: this._scrollLeft,
                        top: this._scrollTop
                    };
                    contentViewLayout.scroll(this, scrollOptions);
                    return;
                }
            }
            this._internalScroll();
        },

        _internalScroll: function() {
            var contentView = this.contentView();
            contentView
                .transform()
                .get("translate")
                .setX(-this._scrollLeft).setY(-this._scrollTop);
        },

        _adjustMomentum: function(momentum, scroll, maxScroll) {
            return ((momentum > 0 && scroll <= 0) ||
                (momentum < maxScroll && scroll >= maxScroll)) ?
                    scroll :
                    Math.max(scroll - this._maxMomentum, Math.min(momentum, scroll + this._maxMomentum));
        },

        _validateScrollWithAnimation: function() {
            var momentumLeft = this._scrollLeft,
                momentumTop =  this._scrollTop;
            if (this._scrollDirection == ScrollView.VERTICAL)
                momentumLeft = Math.max(0, Math.min(momentumLeft, this.maxScrollLeft()));
            if (this._scrollDirection == ScrollView.HORIZONTAL)
                momentumTop = Math.max(0, Math.min(momentumTop, this.maxScrollTop()));
            this._checkScrollPosition();
            momentumLeft = this._adjustMomentum(momentumLeft, this._scrollLeft, this.maxScrollLeft());
            momentumTop = this._adjustMomentum(momentumTop, this._scrollTop, this.maxScrollTop());
            if (this._contentView.getLayout) {
                var contentViewLayout = this._contentView.getLayout();
                if (contentViewLayout && contentViewLayout.scrollWithAnimation) {
                    var scrollOptions = {
                        left: this._scrollLeft,
                        top: this._scrollTop,
                        momentumLeft: momentumLeft,
                        momentumTop: momentumTop,
                        duration: this._scrollAnimationDuration
                    };
                    contentViewLayout.scrollWithAnimation(this, scrollOptions);
                }
            }
            this._internalScrollWithAnimation(momentumLeft, momentumTop);
        },

        _internalScrollWithAnimation: function(momentumLeft, momentumTop) {
            var contentView = this.contentView();
            var chain = contentView.animation()
                .inlineStart()
                .get("scroll")
                    .removeAll()
                    .chain();
            if (momentumLeft != this._scrollLeft ||
                momentumTop != this._scrollTop) {
                chain = chain.transform(this._scrollAnimationDuration / 2,
                                    new Transform().translate(-momentumLeft, -momentumTop))
                             .setTimingFunction("easeOut");
            }
            chain.transform(this._scrollAnimationDuration,
                            new Transform().translate(-this._scrollLeft, -this._scrollTop))
                 .setTimingFunction("easeOut");
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

        respondsToTouchGesture: function(gesture) {
            if (!this._contentView || this._scrollDirection == ScrollView.NONE ||
                gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (this._scrollDirection != ScrollView.VERTICAL && gesture.scrollX) ||
                (this._scrollDirection != ScrollView.HORIZONTAL && gesture.scrollY);
        },

        _stopScrollAnimation: function() {
            this._useAnimation = false;
            var contentView = this.contentView();
            if (contentView.hasAnimation()) {
                var transform = contentView.transform().get("translate");
                this._scrolLeft = -transform.x();
                this._scrollTop = -transform.y();
                this.contentView().animation().stop().get("scroll").removeAll();
            }
        },

        _onTouchDragStart: function() {
            this._stopScrollAnimation();
            this._touchStartState = {
                scrollLeft: this._scrollLeft,
                scrollTop: this._scrollTop
            };
            this._momentumLeft.reset(this._scrollLeft);
            this._momentumTop.reset(this._scrollTop);
            this._canOverScroll = true;
        },

        _onTouchDragMove: function(transform) {
            if (!this._touchStartState)
                return;
            var deltaX = this._touchStartState.scrollLeft - transform.dragX,
                deltaY = this._touchStartState.scrollTop - transform.dragY;
            this._momentumLeft.injectValue(deltaX);
            this._momentumTop.injectValue(deltaY);
            this.scrollTo(deltaX, deltaY);
        },

        _onTouchDragEnd: function(transform) {
            var deltaX = this._touchStartState.scrollLeft - transform.dragX,
                deltaY = this._touchStartState.scrollTop - transform.dragY;
            this._momentumLeft.injectValue(deltaX);
            this._momentumTop.injectValue(deltaY);
            this._scrollLeft = this._momentumLeft.compute();
            this._scrollTop = this._momentumTop.compute();
            this._useAnimation = true;
            this._canOverScroll = false;
            this._touchStartState = null;
            this.invalidate("scroll");
        }
    }, {
        BOTH: "both",
        VERTICAL: "vertical",
        HORIZONTAL: "horizontal",
        NONE: "none"
    });

    return ScrollView;

});