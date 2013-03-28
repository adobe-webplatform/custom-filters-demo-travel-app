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

    var useShadow = true;
    var commitDuration = 300,
        revertDuration = 100;

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
            this._useFilter = false;
            this._momentum = new Momentum().setDuration(commitDuration).setFriction(0.000005);
            this.forceLayer();
            this.setHorizontalLayout();
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
                this._useFilter = true;
            return this;
        },

        _onDragStart: function() {
            app.startTransition(this);
            app.mainView.navigatorView().revertNextCard();
            this._onTapStart();
            var nextCard = app.mainView.navigatorView().nextCard();
            nextCard.filter().get("grayscale").setIntensity(100);
            nextCard.setOpacity(0.5);
            if (this._useFilter) {
                var fold = this._filterView.filter().get("fold");
                if (useShadow)
                    this.filter().get("dropShadow").setRadius(10).setColor(0);
                this._dragStartValue = -fold.t() * this.bounds().width();
            } else {
                var translate = this.transform().get("translate");
                this._dragStartValue = this._verticalLayout ?
                    translate.x() : translate.y();
            }
            if (this._useFilter)
                this.addClass("js-touch-item-view-filter");
            this._momentum.reset(this._dragStartValue);
            this.animation().removeAll();
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

        _onDragMove: function(transform) {
            var nextCard = app.mainView.navigatorView().nextCard(),
                grayscale = nextCard.filter().get("grayscale"),
                value;
            if (!this._useFilter) {
                var translate = this.transform().get("translate");
                if (this._verticalLayout) {
                    value = Math.min(0, this._dragStartValue + transform.dragX);
                    translate.setX(value);
                    grayscale.setIntensity(100 + value / this.bounds().width() * 100);
                    nextCard.setOpacity(-value / this.bounds().width() / 2 + 0.5);
                } else {
                    value = Math.min(0, this._dragStartValue + transform.dragY);
                    translate.setY(value);
                    grayscale.setIntensity(100 + value / this.bounds().height() * 100);
                    nextCard.setOpacity(-value / this.bounds().height() / 2 + 0.5);
                }
            } else {
                value = Math.min(0, this._dragStartValue + transform.dragX);
                var t = Math.min(1, Math.max(0, - value / this.bounds().width()));
                this._filterView.filter().get("fold").setT(this._computeFilterValue(t))
                    .setShadow(this._computeShadow(t))
                    .setWidth(this.bounds().width());
                if (useShadow)
                    this.filter().get("dropShadow").setRadius(10).setColor(t);
                grayscale.setIntensity(100 - t * 100);
                nextCard.setOpacity(t / 2 + 0.5);
            }
            this._momentum.injectValue(value);
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

        _commit: function() {
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard(),
                chain = this.animation().start().get("slide-transform").chain();
            this.off("tap", this._onTap, this);
            app.mainView.navigatorView().precommitNextCard();
            this.trigger("selected", this);
            if (!this._useFilter) {
                var transform = new Transform();
                if (this._verticalLayout)
                    transform.translate(-this.bounds().width(), 0);
                else
                    transform.translate(0, -this.bounds().height());
                chain = chain.transform(commitDuration, transform);
            } else {
                if (useShadow) {
                    var filterShadow = new Filter();
                    filterShadow.get("dropShadow").setRadius(10).setColor(0);
                    chain = chain.filter(commitDuration, filterShadow);
                } else {
                    chain = chain.wait(commitDuration);
                }
                var filter = new Filter();
                filter.get("fold").setT(this._computeFilterValue(1)).setShadow(this._computeShadow(1)).setWidth(this.bounds().width());
                this._filterView.animation().start().get("slide-filter").
                    chain().filter(commitDuration, filter);
            }
            chain.callback(function() {
                    nextCard.filter().clear();
                    app.mainView.navigatorView().commitNextCard();
                    // We are safely hidden, revert the tap listener to the previous state.
                    self.once("tap", self._onTap, self);
                    if (self._useFilter) {
                        self.filter().clear();
                        self._filterView.filter().clear();
                        self.removeClass("js-touch-item-view-filter");
                    }
                    app.endTransition(self);
                });
            if (!this._useFilter) {
                this.animation().get("slide")
                    .chain()
                    .opacity(commitDuration, 0);
            }
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(commitDuration, new Filter().grayscale(0));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(commitDuration, 1);
        },

        _revert: function() {
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard(),
                chain = this.animation().start().get("slide-transform").chain();
            if (!this._useFilter) {
                var transform = new Transform();
                chain = chain.transform(revertDuration, transform);
            } else {
                if (useShadow) {
                    var filterShadow = new Filter();
                    filterShadow.get("dropShadow").setRadius(10).setColor(0);
                    chain = chain.filter(revertDuration, filterShadow);
                } else {
                    chain = chain.wait(revertDuration);
                }
                var filter = new Filter();
                filter.get("fold").setT(this._computeFilterValue(0)).setShadow(this._computeShadow(0)).setWidth(this.bounds().width());
                this._filterView.animation().start().get("slide-filter").
                    chain().filter(revertDuration, filter);
            }
            chain.callback(function() {
                nextCard.filter().clear();
                app.mainView.navigatorView().revertNextCard();
                if (self._useFilter) {
                    self.filter().clear();
                    self._filterView.filter().clear();
                    self.removeClass("js-touch-item-view-filter");
                }
                app.endTransition(self);
            });
            this.animation().get("slide")
                .chain()
                .opacity(revertDuration, 1);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(revertDuration, new Filter().grayscale(100));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(revertDuration, 0.5);
        },

        _onDragEnd: function(transform) {
            this._onDragMove(transform);
            var value = this._momentum.compute() * 4,
                direction = this._momentum.direction();
            if ((this._verticalLayout && ((value > - this.bounds().width()) || (direction < 0))) ||
                (!this._verticalLayout && ((value > - this.bounds().height()) || (direction < 0))))
                return this._revert();
            this._commit();
        },

        _onTap: function() {
            if (!app.canStartTransition())
                return;
            this.trigger("animation:start");
            this._onTapStart();
            if (this._useFilter) {
                this._filterView.filter().get("fold")
                    .setT(this._computeFilterValue(0))
                    .setShadow(this._computeShadow(0))
                    .setWidth(this.bounds().width());
                this.addClass("js-touch-item-view-filter");
                if (useShadow)
                    this.filter().get("dropShadow").setRadius(10).setColor(0);
            }
            this._commit();
        },

        respondsToTouchGesture: function(gesture) {
            if (!app.canStartTransition() || gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (this._verticalLayout && gesture.scrollX && gesture.distanceX > 0) ||
                (!this._verticalLayout && gesture.scrollY);
        },

        setVerticalLayout: function() {
            this._filterView.$el.toggleClass("js-vertical-item-view", true);
            this._verticalLayout = true;
            this.setParams(new LayoutParams().fillParentHeight().matchParentWidth());
        },

        setHorizontalLayout: function() {
            this._filterView.$el.toggleClass("js-vertical-item-view", false);
            this._verticalLayout = false;
            this.setParams(new LayoutParams().fillParentWidth().matchParentHeight());
        }
    });

    return ItemView;

});