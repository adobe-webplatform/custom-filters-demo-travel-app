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

define(['mobileui/ui/navigator-view',
        'mobileui/views/measured-view',
        'mobileui/ui/button-view',
        'views/settings-dialog-view',
        'app'], function(NavigatorView, MeasuredView, ButtonView, SettingsDialogView, app) {

    var AppNavigatorView = NavigatorView.extend({

        initialize: function() {
            AppNavigatorView.__super__.initialize.call(this);
            this.addTopBarButtons();
        },

        render: function() {
            this.$el.addClass("js-app-navigator-view");
            return AppNavigatorView.__super__.render.call(this);
        },

        addTopBarButtons: function() {
            var topBar = this.topBarView();

            this._titleLabel = new MeasuredView()
                .setTextContent("MobileUI")
                .matchParentSize()
                .setIsPositioned(true);
            this._titleLabel.margin().setTop(12);
            topBar.append(this._titleLabel.render().addClass("js-navigator-top-bar-title-view"));

            this._backButton = new ButtonView().setLabel("Back")
                .on("tap", this._onBackButtonTap, this);
            this._backButton.margin().setLeft(10).setTop(5);
            topBar.append(this._backButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-back-button-view"));

            this._homeButton = new ButtonView().setLabel("Home")
                .on("tap", this._onBackButtonTap, this);
            this._homeButton.margin().setLeft(10).setTop(5);
            topBar.append(this._homeButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-home-button-view"));

            this._refreshButton = new ButtonView().setLabel("Refresh")
                .on("tap", this._onRefreshButtonTap, this);
            this._refreshButton.margin().setLeft(10).setTop(5);
            topBar.append(this._refreshButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-refresh-button-view"));

            topBar.appendFiller();

            this._settingsButton = new ButtonView().setLabel("Settings")
                .on("tap", this._onSettingsButtonTap, this);
            this._settingsButton.margin().setRight(10).setTop(5);
            topBar.append(this._settingsButton.render().addClass("js-navigator-top-bar-button-view")
                .addClass("js-navigator-top-bar-settings-button-view"));
        },

        backButton: function() {
            return this._backButton;
        },

        homeButton: function() {
            return this._homeButton;
        },

        updateBackButton: function() {
            if (this.canGoBack()) {
                this._backButton.show();
                this._homeButton.hide();
                this._refreshButton.hide();
            } else {
                this._backButton.hide();
                if (this.activeCard().isDefaultScreen) {
                    this._homeButton.hide();
                    this._refreshButton.show();
                } else {
                    this._homeButton.show();
                    this._refreshButton.hide();
                }
            }
        },

        listButton: function() {
            return this._listButton;
        },

        gridButton: function() {
            return this._gridButton;
        },

        _onBackButtonTap: function() {
            if (!this.popCard())
                this.pushCard(app.router.lookupCard(app.defaultCard));
        },

        _onRefreshButtonTap: function() {
            window.location.reload();
        },

        _onSettingsButtonTap: function() {
            if (this._settingsView)
                return;
            this._settingsView = new SettingsDialogView()
                .once("hide", this._onSettingsViewHidden, this)
                .render()
                .show();
        },

        _onSettingsViewHidden: function() {
            this._settingsView.remove();
            this._settingsView = null;
        }

    });

    return AppNavigatorView;

});