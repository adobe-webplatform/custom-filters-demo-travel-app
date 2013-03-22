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
        'mobileui/ui/window-view',
        'views/app-navigator-view',
        'tests/list'],
    function(app,
             WindowView,
             AppNavigatorView,
             TestsList)
    {

    var MainView = WindowView.extend({

        initialize: function() {
            MainView.__super__.initialize.call(this);
            this._navigatorView = new AppNavigatorView();
            this.append(this._navigatorView.render());
        },

        render: function() {
            MainView.__super__.render.call(this);
            this.$el.addClass("js-main-view");
            return this;
        },

        navigatorView: function() {
            return this._navigatorView;
        },

        lookupCard: function(label, pathOptions) {
            var viewItem = _.find(TestsList, function(item) {
                return item.label == label;
            });
            if (!viewItem)
                return null;
            var ViewConstructor = viewItem.view;
            if (!ViewConstructor)
                return null;
            var view = new ViewConstructor({
                path: pathOptions
            }).render();
            return view;
        }
    });

    app.on("init", function() {
        app.mainView = new MainView({
            el: $("#main").get(0)
        }).render();
    });

    return MainView;

});