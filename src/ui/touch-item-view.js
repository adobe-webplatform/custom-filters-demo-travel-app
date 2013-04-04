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
        "mobileui/utils/momentum",
        "mobileui/utils/transform",
        "mobileui/utils/effects/drag-effect",
        "mobileui/utils/effects/fold-effect",
        "mobileui/utils/effects/warp-effect",
        "mobileui/utils/lock"],
    function(GestureDetector, LayerView, LayoutParams, GestureView, Momentum, Transform, DragEffect, FoldEffect, WarpEffect, app) {

    var Effects = {
        "drag": new DragEffect(/* use grayscale*/ true),
        "fold": new FoldEffect(/* use shadow */ false, /* use grayscale*/ true),
        "warp": new WarpEffect(/* use shadow */ false, /* use grayscale*/ true)
    };

    var commitDuration = 500,
        revertDuration = 100;

    var ItemView = GestureView.extend({
        initialize: function(listView) {
            ItemView.__super__.initialize.call(this);
            this._listView = null;
            this.once("tap", this._onTap, this)
                .on("touchdragstart", this._onDragStart, this)
                .on("touchdragmove", this._onDragMove, this)
                .on("touchdragend", this._onDragEnd, this);
            this.listenTo(this.model, "change:label", this._onLabelChanged);
            this._filterView = new LayerView();
            this.append(this._filterView
                    .matchParentSize()
                    .render()
                    .addClass("js-touch-item-view")
                    .addClass(this.model.get("className")));
            this.$labelEl = $("<div />").addClass("js-touch-item-view-label").appendTo(this._filterView.$el);
            this._dragStartValue = 0;
            this._momentum = new Momentum().setDuration(commitDuration).setFriction(0.000005);
            this.setEffect("drag");
            this.setHorizontalLayout();
            this.forceLayer();
        },

        listView: function() {
            return this._listView;
        },

        setListView: function(listView) {
            this._listView = listView;
            return this;
        },

        setEffect: function(effectOrName) {
            var effect = _.isString(effectOrName) ? Effects[effectOrName] : effectOrName;
            if (!effect.isSupported())
                return;
            this._effect = effect;
            return this;
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

        animateViewDeactived: function(promiseList, scrollView, selectedView, index) {
            var transform = new Transform(),
                translate = transform.get("translate"),
                delta;

            if (!this._verticalLayout) {
                delta = scrollView.scrollLeft() - selectedView.bounds().x();
                if (index > 0)
                    delta = scrollView.bounds().width() - (selectedView.bounds().width() - delta);
                translate.setX(delta);
            } else {
                delta = scrollView.scrollTop() - selectedView.bounds().y();
                if (index > 0)
                    delta = scrollView.bounds().height() - (selectedView.bounds().height() - delta);
                translate.setY(delta);
            }

            // Start from zero.
            this.transform().clear().get("translate");
            this.animation().start()
                .get("slide-transform")
                .chain()
                .transform(commitDuration, transform)
                .setTimingFunction("easeOut");

            promiseList.push(this.animation().promise());
        },

        resetAnimations: function() {
            this.setOpacity(1).transform().clear();
            this.filter().clear();
            this.animation().removeAll();
        },

        navigatorView: function() {
            return this._listView.navigatorView();
        },

        _onDragStart: function(touch) {
            app.startTransition(this);
            this.navigatorView().revertNextCard();
            this._onTapStart();
            var nextCard = this.navigatorView().nextCard();
            this._dragStartValue = this._effect.onDragStart(this, this._filterView, nextCard, this._verticalLayout, touch);
            this._momentum.reset(this._dragStartValue);
        },

        _onDragMove: function(transform) {
            var nextCard = this.navigatorView().nextCard(),
                value = this._effect.onDragMove(this, this._filterView, nextCard, transform, this._dragStartValue,
                    this._verticalLayout);
            this._momentum.injectValue(value);
        },

        _commit: function() {
            var self = this,
                activeCard = this.navigatorView().activeCard(),
                nextCard = this.navigatorView().nextCard();

            activeCard.setDisabled(true);

            this.navigatorView().precommitNextCard();

            // Start animating the rest of the items in the list.
            var promiseList = [];
            this.trigger("selected", this, promiseList);

            var chain = this._effect.commit(commitDuration, this, this._filterView, nextCard, this._verticalLayout);
            promiseList.push(chain.promise());
            
            $.when.apply(null, promiseList).then(function() {
                activeCard.setDisabled(false);
                nextCard.filter().clear();
                self.navigatorView().commitNextCard();
                // We are safely hidden, revert the tap listener to the previous state.
                self.once("tap", self._onTap, self);
                self._effect.cleanup(self, self._filterView, nextCard);
                app.endTransition(self);
            });
        },

        _revert: function() {
            var nextCard = this.navigatorView().nextCard();
            var chain = this._effect.revert(revertDuration, this, this._filterView, nextCard, this._verticalLayout);
            chain.callback(function() {
                this.navigatorView().revertNextCard();
                this._effect.cleanup(this, this._filterView, nextCard);
                app.endTransition(this);
            }, this);
        },

        _onDragEnd: function(transform) {
            this._onDragMove(transform);
            if (this._effect.shouldRevert(this, this._momentum.compute(), this._momentum.direction(), this._verticalLayout))
                return this._revert();
            this._commit();
        },

        _onTap: function(touch) {
            if (!app.canStartTransition())
                return;
            app.startTransition(this);
            this.navigatorView().revertNextCard();
            this.trigger("animation:start");
            this._onTapStart();
            var nextCard = this.navigatorView().nextCard();
            this._effect.onDragStart(this, this._filterView, nextCard, this._verticalLayout, touch);
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