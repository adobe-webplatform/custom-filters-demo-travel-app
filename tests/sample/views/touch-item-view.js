define(["mobileui/ui/navigator-card-view",
        "mobileui/ui/list-view",
        "mobileui/views/gesture-detector",
        "mobileui/views/layout-params",
        "mobileui/views/gesture-view",
        "mobileui/utils/transform",
        "mobileui/utils/momentum",
        "app"],
    function(NavigatorCardView, ListView, GestureDetector, LayoutParams, GestureView, Transform, Momentum, app) {


    var ItemView = GestureView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.on("tap", this._onTap, this)
                .on("tapstart", this._onTapStart, this)
                .on("touchdragstart", this._onDragStart, this)
                .on("touchdragmove", this._onDragMove, this)
                .on("touchdragend", this._onDragEnd, this);
            this.setHorizontalLayout();
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this.$labelEl = $("<div />").addClass("js-city-item-view-label");
            this._dragStartValue = 0;
            this._momentum = new Momentum().setDuration(100);
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-city-item-view")
                .addClass(this.model.get("className"))
                .append(this.$labelEl);
            this._onLabelChanged();
            return this;
        },

        _onLabelChanged: function() {
            this.$labelEl.text(this.model.get("label"));
        },


        _onDragStart: function() {
            this._momentum.reset();
            var translate = this.transform().get("translate");
            this._dragStartValue = this._verticalLayout ? 
                translate.x() : translate.y();
            this.animation().removeAll();
        },

        _onDragMove: function(transform) {
            var translate = this.transform().get("translate");
            var value;
            if (this._verticalLayout) {
                value = Math.min(0, this._dragStartValue + transform.dragX);
                translate.setX(value);
            } else {
                value = Math.min(0, this._dragStartValue + transform.dragY);
                translate.setY(value);
            }
            this._momentum.injectValue(value);
        },

        _revert: function() {
            var self = this,
                transform = new Transform();
            this.animation().start().get("slide-transform")
                .chain()
                .transform(100, transform)
                .callback(function() {
                    app.mainView.navigatorView().revertNextCard();
                });
            this.animation().get("slide")
                .chain()
                .opacity(100, 1);
        },

        animateViewSwitch: function(index) {
            var self = this,
                transform = new Transform();
            if (this._verticalLayout)
                transform.translate(-this.bounds().width(), 0);
            else
                transform.translate(0, -this.bounds().height());
            this.animation().start().get("slide-transform")
                .chain(50 * index)
                .transform(200, transform);
            this.animation().get("slide")
                .chain(50 * index)
                .opacity(200, 0);
        },

        startAnimations: function(index) {
            var self = this,
                translate = this.transform().get("translate");
            if (this._verticalLayout)
                translate.setX(-this.bounds().width());
            else
                translate.setY(-this.bounds().height());
            this.setOpacity(0);
            this.animation().start().get("slide-transform")
                .chain(50 * index)
                .transform(300, new Transform().translate(0, 0));
            this.animation().get("slide")
                .chain(50 * index)
                .opacity(300, 1);
            return this.animation().promise();
        },

        resetAnimations: function() {
            this.setOpacity(1).transform().clear();
            this.animation().removeAll();
        },

        _commit: function() {
            var self = this,
                transform = new Transform();
            if (this._verticalLayout)
                transform.translate(-this.bounds().width(), 0);
            else
                transform.translate(0, -this.bounds().height());
            this.trigger("selected", this);
            this.animation().start().get("slide-transform")
                .chain()
                .transform(300, transform)
                .wait(100)
                .callback(function() {
                    app.mainView.navigatorView().commitNextCard();
                });
            this.animation().get("slide")
                .chain()
                .opacity(300, 0);
        },

        _onDragEnd: function() {
            var value = this._momentum.compute() * 3;
            if ((this._verticalLayout && (value > - this.bounds().width())) ||
                (!this._verticalLayout && (value > - this.bounds().height())))
                return this._revert();
            this._commit();
        },

        _onTap: function() {
            this._commit();
        },

        respondsToTouchGesture: function(gesture) {
            if (gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (this._verticalLayout && gesture.scrollX) ||
                (!this._verticalLayout && gesture.scrollY);
        },

        setVerticalLayout: function() {
            this._verticalLayout = true;
            this.setParams(new LayoutParams().fillParentHeight().matchParentWidth());
        },

        setHorizontalLayout: function() {
            this._verticalLayout = false;
            this.setParams(new LayoutParams().fillParentWidth().matchParentHeight());
        }
    });

    return ItemView;

});