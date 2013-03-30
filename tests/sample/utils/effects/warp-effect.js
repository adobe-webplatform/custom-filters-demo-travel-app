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
        "utils/warp"],
    function(BaseEffect, Filter, Warp) {

    var commitDuration = 300,
        revertDuration = 100;

    function WarpEffect(useShadow, useGrayscale) {
        BaseEffect.call(this);
        this._useShadow = useShadow;
        this._useGrayscale = useGrayscale;
    }

    _.extend(WarpEffect.prototype, BaseEffect.prototype, {
        isSupported: function() {
            return Filter.supportsCustomFilters;
        },
        
        onDragStart: function(containerView, filterView, nextCard, verticalLayout, touch) {
            containerView.animation().removeAll();
            var warp = filterView.forceLayer().filter()
                .get("warp")
                .setX(touch.currentPosition.localX / containerView.bounds().width())
                .setY(1)
                .setShadow(this._computeShadow(0));
            if (this._useShadow)
                containerView.filter().get("dropShadow").setRadius(10).setColor(0);
            containerView.addClass("js-touch-item-view-filter");
            return -warp.y() * containerView.bounds().height();
        },

        _minShadow: 0.7,
        _maxShadow: 1,

        _computeShadow: function(t) {
            return (1 - t) * (this._maxShadow - this._minShadow) + this._minShadow;
        },

        onDragMove: function(containerView, filterView, nextCard, transform, dragStartValue) {
            var value = Math.min(0, dragStartValue + transform.dragY);
            var t = Math.min(1, Math.max(0, 2 + value / containerView.bounds().height()));

            filterView.filter().get("warp")
                .setX(transform.touch.currentPosition.localX / containerView.bounds().width())
                .setY(t)
                .setShadow(this._computeShadow(t));

            if (this._useShadow)
                containerView.filter().get("dropShadow").setRadius(10).setColor(1 - t);

            if (this._useGrayscale)
                nextCard.filter().get("grayscale").setIntensity(t * 100);
            nextCard.setOpacity(1 - t / 2);
            return value;
        },

        shouldRevert: function(containerView, value, direction) {
            value /= containerView.bounds().height();
            return (value > - 1.4) || (direction < 0);
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

            var warp = filterView.filter().get("warp");
            var filter = new Filter();
            filter.get("warp")
                .setX(warp.x())
                .setY(0)
                .setShadow(this._computeShadow(1));
            filterView.animation().start().get("slide-filter")
                .chain().filter(commitDuration, filter);

            if (this._useGrayscale) {
                nextCard.animation().start().get("slide-filter")
                    .chain()
                    .filter(commitDuration, new Filter().grayscale(0));
            }
            nextCard.animation().start().get("slide-opacity")
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

            var warp = filterView.filter().get("warp");
            var filter = new Filter();
            filter.get("warp")
                .setX(warp.x())
                .setY(1)
                .setShadow(this._computeShadow(0));

            filterView.animation().start().get("slide-filter").
                chain().filter(revertDuration, filter);

            containerView.animation().get("slide")
                .chain()
                .opacity(revertDuration, 1);
            if (this._useGrayscale) {
                nextCard.animation().start().get("slide-filter")
                    .chain()
                    .filter(revertDuration, new Filter().grayscale(100));
            }
            nextCard.animation().start().get("slide-opacity")
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

    return WarpEffect;
});