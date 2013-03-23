define(["mobileui/ui/navigator-card-view", 
        "mobileui/utils/transform",
        "mobileui/utils/filter",
        "mobileui/utils/momentum",
        "mobileui/views/gesture-detector", 
        "app"],
    function(NavigatorCardView, Transform, Filter, Momentum, GestureDetector, app) {

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
            if (gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (gesture.scrollX && gesture.distanceX < 0 &&
                app.mainView.navigatorView().activeCard() === this &&
                app.mainView.navigatorView().canGoBack());
        },

        _onDragStart: function() {
            var nextCard = app.mainView.navigatorView().prepareHistoryCard().nextCard();
            nextCard.filter().get("grayscale").setIntensity(100);
            var translate = this.transform().get("translate");
            this._dragStartValue = translate.x();
            this._momentum.reset(this._dragStartValue);
        },

        _onDragMove: function(transform) {
            var translate = this.transform().get("translate"),
                value = Math.max(0, this._dragStartValue + transform.dragX);
            translate.setX(value);
            var nextCard = app.mainView.navigatorView().nextCard();
            nextCard.filter().get("grayscale").setIntensity(100 - value / this.bounds().width() * 100);
            this._momentum.injectValue(value);
        },

        _onDragEnd: function() {
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
                .wait(100)
                .callback(function() {
                    nextCard.filter().clear();
                    app.mainView.navigatorView().commitNextCard();
                });
            this.animation().get("slide")
                .chain()
                .opacity(300, 100);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(300, new Filter().grayscale(0));
        },

        _revert: function() {
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard(),
                transform = new Transform();
            this.animation().start().get("slide-transform").chain()
                .transform(100, transform)
                .callback(function() {
                    nextCard.filter().clear();
                    app.mainView.navigatorView().revertNextCard();
                });
            this.animation().get("slide")
                .chain()
                .opacity(100, 1);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(300, new Filter().grayscale(100));
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