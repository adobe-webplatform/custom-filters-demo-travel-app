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

define(["app", "views/index-view", "cards/list", "tests/list"],
    function(app, IndexView, CardsList, TestsList) {

    var Router = Backbone.Router.extend({
        routes: {
            "card/*path/*options": "card",
            "card/*path": "card",
            "index": "index",
            "*path": "defaultHandler"
        },

        defaultHandler: function() {
            var view = this.lookupCard(app.defaultCard);
            app.mainView.navigatorView().resetCard(view ? view : new IndexView().render());
        },

        index: function() {
            app.mainView.navigatorView().pushCard(new IndexView().render());
        },

        card: function(path, pathOptions) {
            var view = this.lookupCard(decodeURIComponent(path), decodeURIComponent(pathOptions));
            app.mainView.navigatorView().resetCard(view ? view : new IndexView().render());
        },

        lookupCard: function(label, pathOptions) {
            var viewItem = _.find(CardsList, function(item) {
                return item.label == label;
            });
            if (!viewItem) {
                viewItem = _.find(TestsList, function(item) {
                    return item.label == label;
                });
                if (!viewItem)
                    return null;
            }
            var ViewConstructor = viewItem.view;
            if (!ViewConstructor)
                return null;
            var view = new ViewConstructor({
                path: pathOptions
            }).render();
            return view;
        }
    });

    var router = app.router = new Router();

    app.on("start", function() {
        Backbone.history.start({});
    });

    return router;
});