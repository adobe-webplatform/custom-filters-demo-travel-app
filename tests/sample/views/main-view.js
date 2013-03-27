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

define(['app',
        'mobileui/views/layer-view',
        'mobileui/ui/window-view',
        'mobileui/views/touch',
        'mobileui/utils/filter',
        'views/app-navigator-view',
        'views/confirm-dialog-view',
        'utils/cache',
        'utils/fold',
        'utils/settings'],
    function(app,
             LayerView,
             WindowView,
             Touch,
             Filter,
             AppNavigatorView,
             ConfirmDialogView,
             cache,
             fold,
             settings)
    {

    var MainView = WindowView.extend({

        initialize: function() {
            MainView.__super__.initialize.call(this);
            this._navigatorView = new AppNavigatorView();
            this.append(this._navigatorView.render());
            this.listenTo(cache, 'updateready', this._onUpdateReady);
            this._updateConfirmView = null;
            this._exitConfirmView = null;
            if (Filter.supportsCustomFilters) {
                this._filterPool = new LayerView()
                    .setDisabled()
                    .setIsPositioned()
                    .setOpacity(0)
                    .forceLayer();
                this._filterPool.bounds().setY(10000);
                this._filterPool.filter().get("fold");
                this.append(this._filterPool.render());
            }
            document.addEventListener("backbutton", this._handleBackButton.bind(this), true);
        },

        render: function() {
            MainView.__super__.render.call(this);
            this.$el.addClass("js-main-view");
            return this;
        },

        navigatorView: function() {
            return this._navigatorView;
        },

        _onUpdateReady: function() {
            if (this._updateConfirmView)
                return;
            this._updateConfirmView = new ConfirmDialogView()
                .setMessage("New application version is available. Would you like to load the new version now?")
                .render()
                .once("hide", this._onUpdateConfirmViewHidden, this)
                .once("accept", this._onUpdateConfirmViewAccepted, this)
                .show();
        },

        _onUpdateConfirmViewHidden: function() {
            this._updateConfirmView.remove();
            this._updateConfirmView = null;
        },

        _onUpdateConfirmViewAccepted: function() {
            try {
                cache.swapCache();
            } catch(e) {
                // FIXME: We get an INVALID_STATE_ERR if we get here with no cache update.
            }
        },

        _handleBackButton: function() {
            if (!app.canStartTransition())
                return;
            if (!this.navigatorView().canGoBack()) {
                this._confirmExit();
                return;
            }
            this.navigatorView().popCard();
        },

        _confirmExit: function() {
            if (this._exitConfirmView)
                return;
            this._exitConfirmView = new ConfirmDialogView()
                .setMessage("Are you sure you want to quit?")
                .render()
                .once("hide", this._onExitConfirmViewHidden, this)
                .once("accept", this._onExitConfirmViewAccepted, this)
                .show();
        },

        _onExitConfirmViewHidden: function() {
            this._exitConfirmView.remove();
            this._exitConfirmView = null;
        },

        _onExitConfirmViewAccepted: function() {
            window.navigator.app.exitApp();
        }
    });

    app.on("init", function() {
        settings.on("change:touch.preview", function() {
            Touch.preview = settings.getBoolean("touch.preview");
        });
        app.mainView = new MainView({
            el: $("#main").get(0)
        }).render();
    });

    return MainView;

});
