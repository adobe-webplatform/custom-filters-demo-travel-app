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

define(['mobileui/ui/settings-dialog-view',
        'mobileui/ui/button-view',
        'mobileui/utils/cache',
        'mobileui/utils/settings'],
    function(SettingsDialogView, ButtonView, cache, settings) {

    var AppSettingsDialogView = SettingsDialogView.extend({

        initialize: function() {
            AppSettingsDialogView.__super__.initialize.call(this);

            this._addSettingsLine("Preview touch events", "touch.preview");

            var contentView = this.contentView();
            this._updateButton = new ButtonView().setLabel("Check for updates")
                .on("tap", this._onUpdateButtonTap, this);
            this._updateButton.margin().setAll(10);
            this._updateButton.ensureParams().matchParentWidth();
            contentView.append(this._updateButton.render().addClass("dark-button"));

            this._refreshButton = new ButtonView().setLabel("Refresh")
                .on("tap", this._onRefreshButtonTap, this);
            this._refreshButton.margin().setAll(10);
            this._refreshButton.ensureParams().matchParentWidth();
            contentView.append(this._refreshButton.render().addClass("dark-button").addClass("dark-cta"));
        },

        _onUpdateButtonTap: function() {
            this.hide();
            cache.checkForUpdates();
        },

        _onRefreshButtonTap: function() {
            window.location.reload();
        }

    });

    return AppSettingsDialogView;

});