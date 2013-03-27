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

define(["mobileui/views/content-view",
        "views/app-card-view",
        "data/locations",
        "app"],
    function(ContentView,
            AppCardView,
            LocationLabels,
            app) {

    var LocationView = AppCardView.extend({
        initialize: function(options) {
            LocationView.__super__.initialize.call(this);
            this._labelView = new ContentView()
                .matchParentSize()
                .addClass("js-location-view-label");
            this.append(this._labelView.render());
            if (options && options.path) {
                var decodedPath = decodeURIComponent(options.path);
                this.model = LocationLabels.find(function(item) {
                    return item.get("label") == decodedPath;
                });
            }
            if (!this.model)
                this.model = LocationLabels.first();
            this._labelView.setTextContent(this.model.get("label"));
        },

        render: function() {
            this.$el.addClass("js-location-view");

            return LocationView.__super__.render.call(this);
        },

        url: function() {
            return "card/" + encodeURIComponent("Location View") + "/" + encodeURIComponent(this.model.get("label"));
        }
    });

    return {
        label: "Location View",
        view: LocationView
    };

});