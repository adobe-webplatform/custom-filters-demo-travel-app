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

define(["mobileui/utils/underscore",
        "mobileui/utils/text-module",
        "require"],
    function(_, text, require) {

    var TemplateModule = _.extend({}, text, {
        defaultOptions: {
            base: "mobileui/views/layer-view",
            label: ""
        },

        modulePath: "mobileui/views/template-view",

        create: function(content, BaseView, options) {
            var TemplateView = BaseView.extend({
                _template: content,
                render: function() {
                    this.$el.addClass("js-template-view");
                    return TemplateView.__super__.render.call(this);
                }
            }, {
                label: options.label
            });
            return TemplateView;
        },

        encodeContentAsync: function(content, moduleName, parsedName, callback) {
            var options = _.extend({}, this.defaultOptions, parsedName.options),
                self = this;
            require([options.base], function(BaseView) {
                callback(self.create(content, BaseView, options));
            });
        },

        createModule: function(content, moduleName, parsedName) {
            var options = _.extend({}, this.defaultOptions, parsedName.options);
            var code = "define(" + JSON.stringify([options.base, this.modulePath]) + ", " +
                    "function(BaseView, TemplateModule) { return TemplateModule.create(" +
                               JSON.stringify(content) + ", BaseView, " + JSON.stringify(options) +
                               "); });\n";
            return code;
        }
    });

    return TemplateModule;
});