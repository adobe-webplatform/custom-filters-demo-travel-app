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

define(['mobileui/views/layout-view',
        'mobileui/views/layout-params',
        'mobileui/utils/transform',
        'app'],
    function(LayoutView, LayoutParams, Transform, app) {

    var DialogView = LayoutView.extend({

        initialize: function() {
            DialogView.__super__.initialize.call(this);
            this.setParams(new LayoutParams().matchParentWidth().matchChildrenHeight());
            this.setLayout("vertical");
        },

        render: function() {
            DialogView.__super__.render.call(this);
            this.$el.addClass("js-dialog-view");
            return this;
        },

        layout: function() {
            DialogView.__super__.layout.call(this);
            this.bounds().setY(this.parent().bounds().height() - this.bounds().height());
        },

        _makeTransform: function(r1, r2, y) {
            var height = this._attachedView.bounds().height();
            return new Transform()
                    .perspective(1000)
                    .translate(0, y * height)
                    .translate(0, -height / 2)
                    .rotateX(-r1)
                    .translate(0, height)
                    .rotateX(r2)
                    .translate(0, -height / 2);
        },

        _validateShowAnimation: function() {
            this.transform().get("translate").setY(this.bounds().height());
            this.animation().start().get("show-transition").removeAll()
                .chain()
                .transform(300, new Transform().translate());
            this._attachedView.transform().set(this._makeTransform(0, 0, 0));
            this._attachedView.animation().start().get("dialog-transform")
                .removeAll()
                .chain()
                .transform(200, this._makeTransform(35, 0, 0.05))
                .transform(200, this._makeTransform(35, 35, 0.15));
        },

        _validateHideAnimation: function() {
            this.transform().get("translate");
            this.animation().start().get("show-transition").removeAll()
                .chain()
                .transform(400, new Transform().translate(0, this.bounds().height()));
            this._attachedView.animation().start().get("dialog-transform")
                .removeAll()
                .chain()
                .transform(200, this._makeTransform(35, 10, 0.05))
                .transform(200, this._makeTransform(0, 0, 0))
                .callback(this._onHideAnimationEnd, this);
        },

        _onHideAnimationEnd: function() {
            this._attachedView.transform().clear();
            this._attachedView.setDisabled(false);
            this._attachedView = null;
            this.detach();
            this.trigger("hide");
        },

        show: function() {
            app.mainView.append(this);
            this._attachedView = app.mainView.navigatorView();
            this._attachedView.setDisabled(true);
            this.trigger("show");
            this.invalidate("showAnimation");
            return this;
        },

        hide: function() {
            this.invalidate("hideAnimation");
            return this;
        }

    });

    return DialogView;

});