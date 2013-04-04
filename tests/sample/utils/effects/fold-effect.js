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

define(["mobileui/views/layer-view",
        "utils/effects/base-effect",
        "mobileui/utils/filter",
        "mobileui/utils/transform",
        "utils/fold"],
    function(LayerView, BaseEffect, Filter, Transform, Fold) {

    var shadowSize = 40;

    function FoldEffect(useShadow, useGrayscale) {
        BaseEffect.call(this);
        this._useShadow = useShadow;
        this._useGrayscale = useGrayscale;
    }

    _.extend(FoldEffect.prototype, BaseEffect.prototype, {
        isSupported: function() {
            return Filter.supportsCustomFilters;
        },

        _ensureMarginLayer: function(view) {
            if (!view._filterMarginLayer) {
                view._filterMarginLayer = new LayerView().addClass("js-fold-effect-filter-margin");
                view.prepend(view._filterMarginLayer.render());

                var shadow = new LayerView().addClass("js-fold-effect-filter-margin-shadow");
                shadow.ensureParams().matchParentWidth();
                shadow.bounds().setHeight(shadowSize);
                view._filterMarginLayer.append(shadow.render());
                view._filterMarginLayer._shadow = shadow;
            }
            return view._filterMarginLayer;
        },

        _removeMarginLayer: function(view) {
            if (!view._filterMarginLayer)
                return;
            view._filterMarginLayer.remove();
            view._filterMarginLayer = null;
        },

        onDragStart: function(containerView, filterView, nextCard, verticalLayout, touch) {
            containerView.animation().removeAll();
            // Compute the mesh and the margin of the effect
            // so that we get exactly one tile for the shadow.
            var itemHeight = filterView.bounds().height(),
                segmentsY = Math.ceil(itemHeight / shadowSize) + 2,
                marginHeight = (segmentsY * shadowSize - itemHeight) / 2;

            var filterMargins = this._ensureMarginLayer(filterView);
            filterMargins.bounds()
                .setY(-marginHeight)
                .setHeight(itemHeight + 2 * marginHeight)
                .setX(0)
                .setWidth(filterView.bounds().width());
            filterMargins._shadow.bounds()
                .setY(filterMargins.bounds().height() - shadowSize);

            var fold = filterView.forceLayer().filter()
                .get("fold")
                .setSegmentsY(segmentsY)
                .setPaddingHeight(shadowSize)
                .setMarginHeight(marginHeight)
                .setStartPosition(touch.currentPosition.localX)
                .setCurrentPosition(touch.currentPosition.localX)
                .setWidth(containerView.bounds().width())
                .setHeight(containerView.bounds().height());
            if (this._useShadow)
                containerView.filter().get("dropShadow").setRadius(10).setColor(0);
            containerView.addClass("js-touch-item-view-fold-filter");
            return -this._computeFilterValue(0) * containerView.bounds().width();
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
            
            filterView.transform().get("translate")
                .setX(Math.min(0, (dragStartValue + transform.dragX) / 2));

            filterView.filter().get("fold")
                .setCurrentPosition(transform.touch.currentPosition.localX);

            if (this._useShadow)
                containerView.filter().get("dropShadow").setRadius(10).setColor(t);

            if (this._useGrayscale)
                nextCard.filter().get("grayscale").setIntensity(100 - t * 100);
            nextCard.setOpacity(t / 2 + 0.5);
            return value;
        },

        shouldRevert: function(containerView, value, direction) {
            value *= 4;
            return (value > - containerView.bounds().width()) || (direction < 0);
        },

        commit: function(commitDuration, containerView, filterView, nextCard) {
            var chain = containerView.animation().start().get("slide-opacity").chain();

            if (this._useShadow) {
                var filterShadow = new Filter();
                filterShadow.get("dropShadow").setRadius(10).setColor(0);
                chain = chain.filter(commitDuration, filterShadow);
            } else {
                // No filter on the main element, so just do a simple wait.
                chain = chain.wait(commitDuration);
            }

            var startPosition = filterView.filter().get("fold").startPosition();
            filterView.animation().start().get("slide-transform")
                .chain()
                .transform(commitDuration,
                    new Transform().translate(startPosition - 1.5 * containerView.bounds().width(), 0))
                .setTimingFunction("easeOut");

            var filter = filterView.filter().clone();
            filter.get("fold")
                .setCurrentPosition(0);
            filterView.animation().start().get("slide-filter")
                .chain()
                .filter(commitDuration, filter)
                .setTimingFunction("easeOut");

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

        revert: function(revertDuration, containerView, filterView, nextCard) {
            var chain = containerView.animation().start().get("slide-opacity").chain();

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

            filterView.animation().start().get("slide-transform")
                .chain()
                .transform(revertDuration,
                    new Transform().translate(0, 0))
                .setTimingFunction("easeOut");

            var filter = filterView.filter().clone();
            filter.get("fold")
                .setCurrentPosition(filterView.filter().get("fold").startPosition());

            filterView.animation().start().get("slide-filter")
                .chain()
                .filter(revertDuration, filter)
                .setTimingFunction("easeOut");

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
            filterView.filter().clear();
            filterView.transform().clear();
            containerView.filter().clear();
            this._removeMarginLayer(filterView);
            containerView.removeClass("js-touch-item-view-fold-filter");
        }
    });

    return FoldEffect;
});