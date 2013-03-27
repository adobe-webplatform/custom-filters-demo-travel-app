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
        "mobileui/utils/filter"], 
    function(GestureView, LayerView, Transform, Filter) {

    var CheckboxView = GestureView.extend({
        initialize: function() {
            CheckboxView.__super__.initialize.call(this);
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
        }
    });

    return CheckboxView;

});