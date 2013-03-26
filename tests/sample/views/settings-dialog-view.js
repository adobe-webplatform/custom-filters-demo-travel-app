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

define(['views/dialog-view',
        'mobileui/views/layout-view',
        'mobileui/ui/button-view',
        'mobileui/views/layout-params',
        'utils/cache'],
    function(DialogView, LayoutView, ButtonView, LayoutParams, cache) {

    var SettingsDialogView = DialogView.extend({

        initialize: function() {
            SettingsDialogView.__super__.initialize.call(this);
            
            var contentView = this.contentView();
            this._updateButton = new ButtonView().setLabel("Update").on("tap", this._onUpdateButtonTap, this);
            this._updateButton.margin().setAll(10);
            this._updateButton.setParams(new LayoutParams().matchParentWidth());
            contentView.append(this._updateButton.render().addClass("js-dialog-button-view")
                .addClass("js-dialog-update-button-view"));
        },

        render: function() {
            SettingsDialogView.__super__.render.call(this);
            this.$el.addClass("js-settings-dialog-view");
            return this;
        },

        _onUpdateButtonTap: function() {
            this.hide();
            cache.checkForUpdates();
        }

    });

    return SettingsDialogView;

});