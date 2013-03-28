/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["mobileui/views/gesture-detector",
        "mobileui/views/layer-view",
        "mobileui/views/layout-params",
        "mobileui/views/gesture-view",
        "mobileui/utils/transform",
        "mobileui/utils/filter",
        "mobileui/utils/momentum",
        "utils/fold",
        "app"],
    function(GestureDetector, LayerView, LayoutParams, GestureView, Transform, Filter, Momentum, Fold, app) {

    var commitDuration = 300,
        revertDuration = 100;

    function BaseEffect() { }
    function DragEffect(verticalLayout) {
        BaseEffect.call(this);
        this._verticalLayout = verticalLayout;
    }
    function FoldEffect(useShadow) {
        BaseEffect.call(this);
        this._useShadow = useShadow;
    }

    _.extend(BaseEffect.prototype, {
        onDragStart: function(containerView, filterView) {
            return 0;
        },

        onDragMove: function(containerView, filterView, nextCard, transform, dragStartValue) {
            return 0;
        }
    });

    _.extend(DragEffect.prototype, BaseEffect.prototype, {
        onDragStart: function(containerView, filterView, nextCard) {
            containerView.animation().removeAll();
            nextCard.filter().get("grayscale").setIntensity(100);
            nextCard.setOpacity(0.5);

            var translate = containerView.transform().get("translate");
            return this._verticalLayout ? translate.x() : translate.y();
        },

        onDragMove: function(containerView, filterView, nextCard, transform, dragStartValue) {
            var translate = containerView.transform().get("translate"),
                grayscale = nextCard.filter().get("grayscale"),
                value;
            if (this._verticalLayout) {
                value = Math.min(0, dragStartValue + transform.dragX);
                translate.setX(value);
                grayscale.setIntensity(100 + value / containerView.bounds().width() * 100);
                nextCard.setOpacity(-value / containerView.bounds().width() / 2 + 0.5);
            } else {
                value = Math.min(0, dragStartValue + transform.dragY);
                translate.setY(value);
                grayscale.setIntensity(100 + value / containerView.bounds().height() * 100);
                nextCard.setOpacity(-value / containerView.bounds().height() / 2 + 0.5);
            }
            return value;
        },

        shouldRevert: function(containerView, value, direction) {
            value *= 4;
            return ((this._verticalLayout && ((value > - containerView.bounds().width()) || (direction < 0))) ||
                (!this._verticalLayout && ((value > - containerView.bounds().height()) || (direction < 0))));
        },

        commit: function(containerView, filterView, nextCard) {
            var chain = containerView.animation().start().get("slide-transform").chain(),
                transform = new Transform();

            if (this._verticalLayout)
                transform.translate(-containerView.bounds().width(), 0);
            else
                transform.translate(0, -containerView.bounds().height());
            chain = chain.transform(commitDuration, transform);

            containerView.animation().get("slide")
                .chain()
                .opacity(commitDuration, 0);

            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(commitDuration, new Filter().grayscale(0));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(commitDuration, 1);

            return chain;
        },

        revert: function(containerView, filterView, nextCard) {
            var chain = containerView.animation().start().get("slide-transform").chain();
            chain = chain.transform(revertDuration, new Transform());

            containerView.animation().get("slide")
                .chain()
                .opacity(revertDuration, 1);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(revertDuration, new Filter().grayscale(100));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(revertDuration, 0.5);

            return chain;
        },

        cleanup: function(containerView, filterView, nextCard) {
            nextCard.filter().clear();
        }
    });

    _.extend(FoldEffect.prototype, BaseEffect.prototype, {
        onDragStart: function(containerView, filterView) {
            containerView.animation().removeAll();
            var fold = filterView.filter()
                .get("fold")
                .setT(this._computeFilterValue(0))
                .setShadow(this._computeShadow(0))
                .setWidth(containerView.bounds().width());
            if (this._useShadow)
                containerView.filter().get("dropShadow").setRadius(10).setColor(0);
            containerView.addClass("js-touch-item-view-filter");
            return -fold.t() * containerView.bounds().width();
        },

        _minShadow: 0.7,
        _maxShadow: 1,

        _computeShadow: function(t) {
            return (1 - t) * (this._maxShadow - this._minShadow) + this._minShadow;
        },

        _minFilterValue: 0.0,
        _maxFilterValue: 1.0,

        _computeFilterValue: function(t) {
            return this._minFilterValue + t * (this._maxFilterValue - this._minFilterValue);
        },

        onDragMove: function(containerView, filterView, nextCard, transform, dragStartValue) {
            var value = Math.min(0, dragStartValue + transform.dragX);
            var t = Math.min(1, Math.max(0, - value / containerView.bounds().width()));

            filterView.filter().get("fold").setT(this._computeFilterValue(t))
                .setShadow(this._computeShadow(t))
                .setWidth(containerView.bounds().width());

            if (this._useShadow)
                containerView.filter().get("dropShadow").setRadius(10).setColor(t);

            nextCard.filter().get("grayscale").setIntensity(100 - t * 100);
            nextCard.setOpacity(t / 2 + 0.5);
            return value;
        },

        shouldRevert: function(containerView, value, direction) {
            value *= 4;
            return (value > - containerView.bounds().width()) || (direction < 0);
        },

        commit: function(containerView, filterView, nextCard) {
            var chain = containerView.animation().start().get("slide-transform").chain();

            if (this._useShadow) {
                var filterShadow = new Filter();
                filterShadow.get("dropShadow").setRadius(10).setColor(0);
                chain = chain.filter(commitDuration, filterShadow);
            } else {
                // No filter on the main element, so just do a simple wait.
                chain = chain.wait(commitDuration);
            }

            var filter = new Filter();
            filter.get("fold")
                .setT(this._computeFilterValue(1))
                .setShadow(this._computeShadow(1))
                .setWidth(containerView.bounds().width());
            filterView.animation().start().get("slide-filter")
                .chain().filter(commitDuration, filter);

            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(commitDuration, new Filter().grayscale(0));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(commitDuration, 1);

            return chain;
        },

        revert: function(containerView, filterView, nextCard) {
            var chain = containerView.animation().start().get("slide-transform").chain();

            if (this._useShadow) {
                var filterShadow = new Filter();
                filterShadow.get("dropShadow")
                    .setRadius(10)
                    .setColor(0);
                chain = chain.filter(revertDuration, new Filter());
            } else {
                // No filter on the main element, so just do a simple wait.
                chain = chain.wait(revertDuration);
            }

            var filter = new Filter();
            filter.get("fold")
                .setT(this._computeFilterValue(0))
                .setShadow(this._computeShadow(0))
                .setWidth(containerView.bounds().width());

            filterView.animation().start().get("slide-filter").
                chain().filter(revertDuration, filter);

            containerView.animation().get("slide")
                .chain()
                .opacity(revertDuration, 1);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(revertDuration, new Filter().grayscale(100));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(revertDuration, 0.5);

            return chain;
        },

        cleanup: function(containerView, filterView, nextCard) {
            nextCard.filter().clear();
            containerView.filter().clear();
            filterView.filter().clear();
            containerView.removeClass("js-touch-item-view-filter");
        }
    });

    var Effects = {
        "drag-vertical": new DragEffect(true),
        "drag-horizontal": new DragEffect(false),
        "fold": new FoldEffect(true)
    };

    var ItemView = GestureView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.once("tap", this._onTap, this)
                .on("touchdragstart", this._onDragStart, this)
                .on("touchdragmove", this._onDragMove, this)
                .on("touchdragend", this._onDragEnd, this);
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this._filterView = new LayerView();
            this.append(this._filterView
                    .matchParentSize()
                    .forceLayer()
                    .render()
                    .addClass("js-touch-item-view")
                    .addClass(this.model.get("className")));
            this.$labelEl = $("<div />").addClass("js-touch-item-view-label").appendTo(this._filterView.$el);
            this._dragStartValue = 0;
            this._momentum = new Momentum().setDuration(commitDuration).setFriction(0.000005);
            this.forceLayer();
            this.setHorizontalLayout();
        },

        setEffect: function(effectName) {
            this._effect = Effects[effectName];
        },

        filterView: function() {
            return this._filterView;
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-touch-item-parent-view");
            this._onLabelChanged();
            return this;
        },

        _onLabelChanged: function() {
            this.$labelEl.text(this.model.get("label"));
        },

        useFoldingFilters: function() {
            if (Filter.supportsCustomFilters)
                this.setEffect("fold");
            return this;
        },

        animateViewDeactived: function() {
            this.animation().start()
                .get("slide-opacity")
                .chain()
                .opacity(commitDuration, 0);
        },

        resetAnimations: function() {
            this.setOpacity(1).transform().clear();
            this.filter().clear();
            this.animation().removeAll();
        },

        _onDragStart: function() {
            app.startTransition(this);
            app.mainView.navigatorView().revertNextCard();
            this._onTapStart();
            var nextCard = app.mainView.navigatorView().nextCard();
            this._dragStartValue = this._effect.onDragStart(this, this._filterView, nextCard);
            this._momentum.reset(this._dragStartValue);
        },

        _onDragMove: function(transform) {
            var nextCard = app.mainView.navigatorView().nextCard(),
                value = this._effect.onDragMove(this, this._filterView, nextCard, transform, this._dragStartValue);
            this._momentum.injectValue(value);
        },

        _commit: function() {
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard();

            // Disable the tap while animating.
            this.off("tap", this._onTap, this);

            app.mainView.navigatorView().precommitNextCard();

            // Start animating the rest of the items in the list.
            this.trigger("selected", this);

            var chain = this._effect.commit(this, this._filterView, nextCard);
            chain.callback(function() {
                    nextCard.filter().clear();
                    app.mainView.navigatorView().commitNextCard();
                    // We are safely hidden, revert the tap listener to the previous state.
                    self.once("tap", self._onTap, self);
                    self._effect.cleanup(self, self._filterView, nextCard);
                    app.endTransition(self);
                });
        },

        _revert: function() {
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard();
            var chain = this._effect.revert(this, this._filterView, nextCard);
            chain.callback(function() {
                app.mainView.navigatorView().revertNextCard();
                self._effect.cleanup(self, self._filterView, nextCard);
                app.endTransition(self);
            });
        },

        _onDragEnd: function(transform) {
            this._onDragMove(transform);
            if (this._effect.shouldRevert(this, this._momentum.compute(), this._momentum.direction()))
                return this._revert();
            this._commit();
        },

        _onTap: function() {
            if (!app.canStartTransition())
                return;
            this.trigger("animation:start");
            this._onTapStart();
            var nextCard = app.mainView.navigatorView().nextCard();
            this._effect.onDragStart(this, this._filterView, nextCard);
            this._commit();
        },

        respondsToTouchGesture: function(gesture) {
            if (!app.canStartTransition() || gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (this._verticalLayout && gesture.scrollX && gesture.distanceX > 0) ||
                (!this._verticalLayout && gesture.scrollY);
        },

        setVerticalLayout: function() {
            this.setEffect("drag-vertical");
            this._filterView.$el.toggleClass("js-vertical-item-view", true);
            this._verticalLayout = true;
            this.setParams(new LayoutParams().fillParentHeight().matchParentWidth());
        },

        setHorizontalLayout: function() {
            this.setEffect("drag-horizontal");
            this._filterView.$el.toggleClass("js-vertical-item-view", false);
            this._verticalLayout = false;
            this.setParams(new LayoutParams().fillParentWidth().matchParentHeight());
        }
    });

    return ItemView;

});