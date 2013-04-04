define(["mobileui/ui/navigator-card-view",
        "mobileui/views/layer-view",
        "mobileui/utils/transform",
        "mobileui/utils/filter",
        "mobileui/utils/momentum",
        "mobileui/views/gesture-detector",
        "mobileui/utils/lock"],
    function(NavigatorCardView, LayerView, Transform, Filter, Momentum, GestureDetector, app) {

    var AppCardView = NavigatorCardView.extend({
        initialize: function() {
            AppCardView.__super__.initialize.call(this);
            this.addGestureDetector();
            this.on("touchdragstart", this._onDragStart, this)
                .on("touchdragmove", this._onDragMove, this)
                .on("touchdragend", this._onDragEnd, this);
            this._momentum = new Momentum().setDuration(300).setFriction(0.000005);
            this._dragStartValue = 0;
            this.forceLayer();
        },

        render: function() {
            this.$el.addClass("js-app-card-view");
            return AppCardView.__super__.render.call(this);
        },

        respondsToTouchGesture: function(gesture) {
            if (!app.canStartTransition() || gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (gesture.scrollX && gesture.distanceX < 0 &&
                this.navigatorView().activeCard() === this &&
                this.navigatorView().canGoBack());
        },

        _backgroundViewOpacity: 0.7,
        _backgroundViewScale: 0.95,

        _ensureGrayscaleOverlay: function() {
            if (!this._grayscaleOverlay) {
                this._grayscaleOverlay = new LayerView()
                    .setDisabled(true)
                    .matchParentSize().setOpacity(this._backgroundViewOpacity).render()
                    .addClass("js-app-card-grayscale-overlay");
            }
            return this._grayscaleOverlay;
        },

        _onDragStart: function() {
            app.startTransition(this);
            var nextCard = this.navigatorView().prepareHistoryCard().nextCard();
            this._ensureGrayscaleOverlay();
            nextCard.parent().after(this._grayscaleOverlay, nextCard);
            nextCard.transform().get("scale")
                .setX(this._backgroundViewScale)
                .setY(this._backgroundViewScale);
            nextCard.filter().get("grayscale").setIntensity(100);
            var translate = this.transform().get("translate");
            this._dragStartValue = translate.x();
            this._momentum.reset(this._dragStartValue);
        },

        _onDragMove: function(transform) {
            var translate = this.transform().get("translate"),
                value = Math.max(0, this._dragStartValue + transform.dragX);
            translate.setX(value);
            var nextCard = this.navigatorView().nextCard(),
                percentCovered = value / this.bounds().width();
            nextCard.filter().get("grayscale").setIntensity(100 - percentCovered * 100);
            this._grayscaleOverlay.setOpacity(this._backgroundViewOpacity - percentCovered * this._backgroundViewOpacity);
            var scale = this._backgroundViewScale + percentCovered * (1 - this._backgroundViewScale);
            nextCard.transform().get("scale")
                .setX(scale)
                .setY(scale);
            if (nextCard.displaysOnTop()) {
                // Take the menu with us.
                this.topBarView().transform().get("translate").setX(value);
            }
            this._momentum.injectValue(value);
        },

        _onDragEnd: function(transform) {
            this._onDragMove(transform);
            var value = this._momentum.compute() * 4,
                direction = this._momentum.direction();
            if ((value < this.bounds().width()) || (direction > 0))
                return this._revert();
            this._commit();
        },

        _commit: function() {
            var nextCard = this.navigatorView().nextCard();
            this.navigatorView().precommitNextCard();
            var transform = new Transform().translate(this.bounds().width(), 0);
            this.setDisabled(true)
                .animation().start().get("slide-transform")
                .chain()
                .transform(300, transform)
                .callback(function() {
                    this.setDisabled(false)
                        ._removeGrayscaleOverlay();
                    nextCard.filter().clear();
                    app.endTransition(this);
                    this.navigatorView().commitNextCard();
                }, this);
            this.animation().get("slide")
                .chain()
                .opacity(300, 100);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(300, new Filter().grayscale(0));
            nextCard.animation().get("slide-transform")
                .chain()
                .transform(300, new Transform().scale(1, 1))
                .callback(function() {
                    nextCard.transform().clear();
                });
            if (nextCard.displaysOnTop()) {
                // Take the menu with us.
                var topBarView = this.topBarView();
                topBarView.animation().start().get("card-slide")
                    .removeAll()
                    .chain()
                    .transform(300, new Transform().translate(this.bounds().width(), 0))
                    .callback(function() {
                        topBarView.transform().clear();
                    });
            }
            this._grayscaleOverlay.animation().start().get("slide-opacity")
                .chain()
                .opacity(300, 0);
        },

        _revert: function() {
            var nextCard = this.navigatorView().nextCard(),
                transform = new Transform();
            this.animation().start().get("slide-transform").chain()
                .transform(100, transform)
                .callback(function() {
                    this._removeGrayscaleOverlay();
                    app.endTransition(this);
                    this.navigatorView().revertNextCard();
                }, this);
            this.animation().get("slide")
                .chain()
                .opacity(100, 1);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(100, new Filter().grayscale(100))
                .callback(function() {
                    nextCard.filter().clear();
                });
            nextCard.animation().get("slide-transform")
                .chain()
                .transform(100, new Transform().scale(this._backgroundViewScale, this._backgroundViewScale))
                .callback(function() {
                    nextCard.transform().clear();
                });
            if (nextCard.displaysOnTop()) {
                // Take the menu with us.
                this.topBarView().animation().start().get("card-slide")
                    .removeAll()
                    .chain()
                    .transform(100, new Transform());
            }
            this._grayscaleOverlay.animation().start().get("slide-opacity")
                .chain()
                .opacity(100, this._backgroundViewOpacity);
        },

        _removeGrayscaleOverlay: function() {
            if (!this._grayscaleOverlay)
                return;
            this._grayscaleOverlay.remove();
            this._grayscaleOverlay = null;
        },

        _onActivate: function(options) {
            AppCardView.__super__._onActivate.call(this, options);
            if (!options.goingBack || !app.canStartTransition())
                return;
            var prevCard = options.previousCard;
            if (!prevCard || !prevCard._animateBackButton)
                return;
            prevCard._animateBackButton(this, options);
        },

        _animateBackButton: function(nextCard, options) {
            var self = this;
            app.startTransition();
            this._ensureGrayscaleOverlay();
            nextCard.parent().after(this._grayscaleOverlay, nextCard);
            var transform = new Transform().translate(this.bounds().width(), 0);
            this.animation().start().get("slide-transform")
                .chain()
                .transform(300, transform)
                .callback(function() {
                    self._removeGrayscaleOverlay();
                    nextCard.filter().clear();
                    app.endTransition(self);
                });
            this.animation().get("slide")
                .chain()
                .opacity(300, 100);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(300, new Filter().grayscale(100), new Filter().grayscale(0));
            nextCard.animation().get("slide-transform")
                .chain()
                .transform(300,
                    new Transform().scale(this._backgroundViewScale, this._backgroundViewScale),
                    new Transform().scale(1, 1))
                .callback(function() {
                    nextCard.transform().clear();
                });
            if (nextCard.displaysOnTop()) {
                // Take the menu with us.
                var topBarView = this.topBarView();
                topBarView.animation().start().get("card-slide")
                    .removeAll()
                    .chain()
                    .transform(300, new Transform().translate(this.bounds().width(), 0))
                    .callback(function() {
                        topBarView.transform().clear();
                    });
            }
            this._grayscaleOverlay.animation().start().get("slide-opacity")
                .chain()
                .opacity(300, this._backgroundViewOpacity, 0);

            options.promise = this.animation().promise();
        }

    });

    return AppCardView;

});