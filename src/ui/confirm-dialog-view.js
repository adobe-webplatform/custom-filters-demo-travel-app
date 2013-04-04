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

define(['mobileui/ui/dialog-view',
        'mobileui/views/layout-view',
        'mobileui/views/measured-view',
        'mobileui/ui/button-view',
        'mobileui/views/layout-params'],
    function(DialogView, LayoutView, MeasuredView, ButtonView, LayoutParams) {

    var ConfirmDialogView = DialogView.extend({

        initialize: function() {
            ConfirmDialogView.__super__.initialize.call(this);
            this._message = "Yes/No?";

            var contentView = this.contentView();

            this._labelView = new MeasuredView();
            this._labelView.margin().setAll(10);
            this._labelView.setParams(new LayoutParams().matchParentWidth());
            contentView.append(this._labelView.render());

            this._acceptButton = new ButtonView()
                .setLabel("Yes")
                .on("tap", this._onAcceptButtonTap, this)
                .addClass("dark-button").addClass("dark-cta");
            this._acceptButton.margin().setAll(10);
            this._acceptButton.ensureParams().matchParentWidth();
            contentView.append(this._acceptButton.render());

            this._refuseButton = new ButtonView()
                .setLabel("No")
                .on("tap", this._onRefuseButtonTap, this)
                .addClass("dark-button");
            this._refuseButton.margin().setAll(10);
            this._refuseButton.ensureParams().matchParentWidth();
            contentView.append(this._refuseButton.render());
        },

        setMessage: function(message) {
            if (this._message == message)
                return;
            this._message = message;
            this._labelView.setTextContent(message);
            return this;
        },

        render: function() {
            ConfirmDialogView.__super__.render.call(this);
            this.$el.addClass("js-confirm-dialog-view");
            return this;
        },

        _onAcceptButtonTap: function() {
            this.trigger("accept");
            this.hide();
        },

        _onRefuseButtonTap: function() {
            this.trigger("refuse");
            this.hide();
        }

    });

    return ConfirmDialogView;

});