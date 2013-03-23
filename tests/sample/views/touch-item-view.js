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
        "mobileui/views/layout-params",
        "mobileui/views/gesture-view",
        "mobileui/utils/transform",
        "mobileui/utils/filter",
        "mobileui/utils/momentum",
        "utils/fold",
        "app"],
    function(GestureDetector, LayoutParams, GestureView, Transform, Filter, Momentum, Fold, app) {


    var ItemView = GestureView.extend({
        initialize: function() {
            ItemView.__super__.initialize.call(this);
            this.once("tap", this._onTap, this)
                .on("touchdragstart", this._onDragStart, this)
                .on("touchdragmove", this._onDragMove, this)
                .on("touchdragend", this._onDragEnd, this);
            this.setHorizontalLayout();
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this.$labelEl = $("<div />").addClass("js-touch-item-view-label");
            this._dragStartValue = 0;
            this._useFilter = false;
            this._momentum = new Momentum().setDuration(300).setFriction(0.000005);
            this.forceLayer();
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.$el.addClass("js-touch-item-view")
                .addClass(this.model.get("className"))
                .append(this.$labelEl);
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
            this._onTapStart();
            var nextCard = app.mainView.navigatorView().nextCard();
            nextCard.filter().get("grayscale").setIntensity(100);
            nextCard.setOpacity(0.5);
            if (this._useFilter) {
                var fold = this.filter().get("fold");
                this._dragStartValue = -fold.t() * this.bounds().width();
            } else {
                var translate = this.transform().get("translate");
                this._dragStartValue = this._verticalLayout ?
                    translate.x() : translate.y();
            }
            this._momentum.reset(this._dragStartValue);
            this.animation().removeAll();
        },

        _minShadow: 1.2,
        _maxShadow: 2,

        _computeShadow: function(t) {
            return (1 - t) * (this._maxShadow - this._minShadow) + this._minShadow;
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
                var t = Math.min(0.999, Math.max(0, - value / this.bounds().width()));
                this.filter().get("fold").setT(t).setShadow(this._computeShadow(t));
                grayscale.setIntensity(100 - t * 100);
                nextCard.setOpacity(t / 2 + 0.5);
            }
            this._momentum.injectValue(value);
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
                chain = chain.transform(300, transform);
            } else {
                var filter = new Filter();
                filter.get("fold").setT(2).setShadow(this._computeShadow(1));
                chain = chain.wait(0).filter(300, filter);
            }
            chain.callback(function() {
                    nextCard.filter().clear();
                    app.mainView.navigatorView().commitNextCard();
                    // We are safely hidden, revert the tap listener to the previous state.
                    self.once("tap", self._onTap, self);
                });
            this.animation().get("slide")
                .chain()
                .opacity(300, 0);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(300, new Filter().grayscale(0));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(300, 1);
        },

        _revert: function() {
            var self = this,
                nextCard = app.mainView.navigatorView().nextCard(),
                chain = this.animation().start().get("slide-transform").chain();
            if (!this._useFilter) {
                var transform = new Transform();
                chain = chain.transform(100, transform);
            } else {
                var filter = new Filter();
                filter.get("fold").setT(0).setShadow(this._computeShadow(0));
                chain = chain.filter(100, filter);
            }
            chain.callback(function() {
                nextCard.filter().clear();
                app.mainView.navigatorView().revertNextCard();
            });
            this.animation().get("slide")
                .chain()
                .opacity(100, 1);
            nextCard.animation().start().get("slide-filter")
                .chain()
                .filter(300, new Filter().grayscale(100));
            nextCard.animation().get("slide-opacity")
                .chain()
                .opacity(300, 0.5);
        },

        _onDragEnd: function(transform) {
            this._onDragMove(transform);
            var value = this._momentum.compute(),
                direction = this._momentum.direction();
            value *= 4;
            if ((this._verticalLayout && ((value > - this.bounds().width()) || (direction < 0))) ||
                (!this._verticalLayout && ((value > - this.bounds().height()) || (direction < 0))))
                return this._revert();
            this._commit();
        },

        _onTap: function() {
            this._onTapStart();
            this._commit();
        },

        respondsToTouchGesture: function(gesture) {
            if (gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (this._verticalLayout && gesture.scrollX && gesture.distanceX > 0) ||
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