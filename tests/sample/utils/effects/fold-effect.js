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

define(["utils/effects/base-effect",
        "mobileui/utils/filter",
        "utils/fold"],
    function(BaseEffect, Filter, Fold) {

    var commitDuration = 300,
        revertDuration = 100;

    function FoldEffect(useShadow) {
        BaseEffect.call(this);
        this._useShadow = useShadow;
    }

    _.extend(FoldEffect.prototype, BaseEffect.prototype, {
        isSupported: function() {
            return Filter.supportsCustomFilters;
        },

        onDragStart: function(containerView, filterView) {
            containerView.animation().removeAll();
            var fold = filterView.forceLayer().filter()
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

    return FoldEffect;
});