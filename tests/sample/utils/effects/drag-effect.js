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
        "mobileui/utils/transform",
        "mobileui/utils/filter"],
    function(BaseEffect, Transform, Filter) {

    var commitDuration = 300,
        revertDuration = 100;

    function DragEffect(useGrayscale) {
        BaseEffect.call(this);
        this._useGrayscale = useGrayscale;
    }

    _.extend(DragEffect.prototype, BaseEffect.prototype, {
        isSupported: function() {
            return true;
        },

        onDragStart: function(containerView, filterView, nextCard, verticalLayout) {
            containerView.animation().removeAll();
            if (this._useGrayscale)
                nextCard.filter().get("grayscale").setIntensity(100);
            nextCard.setOpacity(0.5);

            var translate = containerView.forceLayer().transform().get("translate");
            return verticalLayout ? translate.x() : translate.y();
        },

        onDragMove: function(containerView, filterView, nextCard, transform, dragStartValue, verticalLayout) {
            var translate = containerView.transform().get("translate"),
                grayscale = this._useGrayscale ? nextCard.filter().get("grayscale") : null,
                value;
            if (verticalLayout) {
                value = Math.min(0, dragStartValue + transform.dragX);
                translate.setX(value);
                if (this._useGrayscale)
                    grayscale.setIntensity(100 + value / containerView.bounds().width() * 100);
                nextCard.setOpacity(-value / containerView.bounds().width() / 2 + 0.5);
            } else {
                value = Math.min(0, dragStartValue + transform.dragY);
                translate.setY(value);
                if (this._useGrayscale)
                    grayscale.setIntensity(100 + value / containerView.bounds().height() * 100);
                nextCard.setOpacity(-value / containerView.bounds().height() / 2 + 0.5);
            }
            return value;
        },

        shouldRevert: function(containerView, value, direction, verticalLayout) {
            value *= 4;
            return ((verticalLayout && ((value > - containerView.bounds().width()) || (direction < 0))) ||
                (!verticalLayout && ((value > - containerView.bounds().height()) || (direction < 0))));
        },

        commit: function(containerView, filterView, nextCard, verticalLayout) {
            var chain = containerView.animation().start().get("slide-transform").chain(),
                transform = new Transform();

            if (verticalLayout)
                transform.translate(-containerView.bounds().width(), 0);
            else
                transform.translate(0, -containerView.bounds().height());
            chain = chain.transform(commitDuration, transform);

            containerView.animation().get("slide")
                .chain()
                .opacity(commitDuration, 0);

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
            chain = chain.transform(revertDuration, new Transform());

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
        }
    });

    return DragEffect;

});
