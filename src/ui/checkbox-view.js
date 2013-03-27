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

define([
        "mobileui/views/gesture-view",
        "mobileui/views/layer-view",
        "mobileui/utils/transform",
        "mobileui/utils/filter",
        "mobileui/utils/momentum",
        "mobileui/views/gesture-detector"], 
    function(GestureView, LayerView, Transform, Filter, Momentum, GestureDetector) {

    var CheckboxView = GestureView.extend({
        initialize: function() {
            CheckboxView.__super__.initialize.call(this);
            this.addGestureDetector();
            this.on("touchdragstart", this._onDragStart, this)
                .on("touchdragmove", this._onDragMove, this)
                .on("touchdragend", this._onDragEnd, this);
            this._momentum = new Momentum().setDuration(100).setFriction(0.000005);
            this._dragStartValue = 0;
            this.bounds().setSize(100, 30);
            this.forceLayer();
            this._needleView = new LayerView();
            this._needleView.forceLayer().ensureParams().matchParentHeight().setWidth(0.5);
            this.append(this._needleView.render().addClass("js-checkbox-needle-view"));
            this.on("tap", this._onTap, this);
            this.on("tapend", this._onTapEnd, this);
            this._checked = false;
        },

        setChecked: function(checked) {
            if (this._checked == checked)
                return this;
            this._checked = checked;
            this.invalidate("checked");
            this.trigger("change");
            return this;
        },

        checked: function() {
            return this._checked;
        },

        toggle: function() {
            this._checked = !this._checked;
            this.invalidate("checkedWithAnimation");
            this.trigger("change");
            return this;
        },

        layout: function() {
            CheckboxView.__super__.layout.call(this);
            this._validateChecked();
        },

        render: function() {
            CheckboxView.__super__.render.call(this);
            this.$el.addClass("js-checkbox-view");
            this._validateChecked();
            return this;
        },

        _needlePosition: function() {
            return this._checked ? this.bounds().width() / 2 : 0;
        },

        _needleFilterOpacity: function() {
            return this._checked ? 0 : 100;
        },

        _validateChecked: function() {
            this._needleView.transform().get("translate").setX(this._needlePosition());
            this._needleView.filter().get("grayscale").setIntensity(this._needleFilterOpacity());
        },

        _validateCheckedWithAnimation: function() {
            this._needleView.animation().start()
                .get("checkbox-transform").removeAll()
                .chain()
                .transform(100, new Transform().translate(this._needlePosition(), 0));
            this._needleView.animation()
                .get("checkbox-filter").removeAll()
                .chain()
                .filter(100, new Filter().grayscale(this._needleFilterOpacity()));
        },

        _onTap: function() {
            this.toggle();
        },

        _onDragStart: function() {
            var translate = this._needleView.transform().get("translate");
            this._dragStartValue = translate.x();
            this._momentum.reset(this._dragStartValue);
        },

        _onDragMove: function(transform) {
            var translate = this._needleView.transform().get("translate"),
                value = Math.max(0, this._dragStartValue + transform.dragX),
                position = Math.min(this.bounds().width() / 2, Math.max(0, value));
            translate.setX(position);
            this._needleView.filter().get("grayscale")
                .setIntensity(100 - position / this.bounds().width() * 200);
            this._momentum.injectValue(value);
        },

        _onDragEnd: function(transform) {
            this._onDragMove(transform);
            var value = this._momentum.compute(),
                direction = this._momentum.direction(),
                oneQuadWidth = this.bounds().width() / 4;
            if (!this._checked && ((value < oneQuadWidth) || (direction > 0)))
                return this._revert();
            if (this._checked && ((value > oneQuadWidth * 3) || (direction < 0)))
                return this._revert();
            this._commit();
        },

        _commit: function() {
            this.toggle();
        },

        _revert: function() {
            this._validateCheckedWithAnimation();
        },

        respondsToTouchGesture: function(gesture) {
            if (gesture.type != GestureDetector.GestureType.DRAG || !gesture.scrollX)
                return false;
            return (this._checked) ? gesture.distanceX > 0 : gesture.distanceX < 0;
        }
    });

    return CheckboxView;

});