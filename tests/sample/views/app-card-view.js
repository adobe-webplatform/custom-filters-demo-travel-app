define(["mobileui/ui/navigator-card-view",
        "mobileui/views/layer-view",
        "mobileui/utils/transform",
        "mobileui/utils/filter",
        "mobileui/utils/momentum",
        "mobileui/views/gesture-detector",
        "app"],
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
            this.on("card:precommit", this._updateBackButton, this);
            this.on("activate", this._updateBackButton, this);
            this.forceLayer();
        },

        _updateBackButton: function() {
            app.mainView.navigatorView().updateBackButton();
        },

        render: function() {
            this.$el.addClass("js-app-card-view");
            return AppCardView.__super__.render.call(this);
        },

        respondsToTouchGesture: function(gesture) {
            if (!app.canStartTransition() || gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (gesture.scrollX && gesture.distanceX < 0 &&
                app.mainView.navigatorView().activeCard() === this &&
                app.mainView.navigatorView().canGoBack());
        },

        _backgroundViewOpacity: 0.7,
        _backgroundViewScale: 0.9,

        _onDragStart: function() {
            app.startTransition(this);
            var nextCard = app.mainView.navigatorView().prepareHistoryCard().nextCard();
            if (!this._grayscaleOverlay)
                this._grayscaleOverlay = new LayerView()
                    .matchParentSize().setOpacity(this._backgroundViewOpacity).render()
                    .addClass("js-app-card-grayscale-overlay");
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
            var nextCard = app.mainView.navigatorView().nextCard(),
                percentCovered = value / this.bounds().width();
            nextCard.filter().get("grayscale").setIntensity(100 - percentCovered * 100);
            this._grayscaleOverlay.setOpacity(this._backgroundViewOpacity - percentCovered * this._backgroundViewOpacity);
            var scale = this._backgroundViewScale + percentCovered * (1 - this._backgroundViewScale);
            nextCard.transform().get("scale")
                .setX(scale)
                .setY(scale);
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
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard();
            app.mainView.navigatorView().precommitNextCard();
            var transform = new Transform().translate(this.bounds().width(), 0);
            this.animation().start().get("slide-transform")
                .chain()
                .transform(300, transform)
                .callback(function() {
                    self._removeGrayscaleOverlay();
                    nextCard.filter().clear();
                    app.endTransition(self);
                    app.mainView.navigatorView().commitNextCard();
                });
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
            this._grayscaleOverlay.animation().start().get("slide-opacity")
                .chain()
                .opacity(300, 0);
        },

        _revert: function() {
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard(),
                transform = new Transform();
            this.animation().start().get("slide-transform").chain()
                .transform(100, transform)
                .callback(function() {
                    self._removeGrayscaleOverlay();
                    app.endTransition(self);
                    app.mainView.navigatorView().revertNextCard();
                });
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
            this._grayscaleOverlay.animation().start().get("slide-opacity")
                .chain()
                .opacity(300, this._backgroundViewOpacity);
        },

        _removeGrayscaleOverlay: function() {
            if (!this._grayscaleOverlay)
                return;
            this._grayscaleOverlay.remove();
            this._grayscaleOverlay = null;
        },

        url: function() {
            return null;
        },

        updateRouterLocation: function() {
            var url = this.url();
            if (!url)
                return;
            app.router.navigate(url, { trigger: false });
        }
    });

    return AppCardView;

});