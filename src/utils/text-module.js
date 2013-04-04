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
/* Module based on requirejs.text to provide ahead of time text encoding. */
define(["mobileui/utils/underscore", "mobileui/utils/load-module"], 
    function (_, fileLoader) {
    
    var text = {

        // Overwrite this function in your sub-classes to 
        // provide different content.
        encodeContent: function(content, moduleName, parsedName) {
            return content;
        },

        // Overwrite this function in your sub-classes to 
        // provide different content.
        createModule: function(content, moduleName, parsedName) {
            return "define(function () { return " +
                               JSON.stringify(this.encodeContent(content, moduleName)) +
                               ";});\n";
        },

        encodeContentAsync: function(content, moduleName, parsedName, callback) {
            callback(this.encodeContent(content, moduleName, parsedName));
        },

        parseName: function (name) {
            var parts = name.split("?");
            return {
                file: parts[0],
                options: this.parseUrlComponents(parts[1])
            };
        },

        parseUrlComponents: function(components) {
            if (!components)
                return null;
            var parts = components.split("&"),
                options = {};
            _.each(parts, function(value) {
                var componentParts = value.split("=");
                options[decodeURIComponent(componentParts[0])] = decodeURIComponent(componentParts[1]);
            });
            return options;
        },

        saveModuleContent: function(content, moduleName, parsedName) {
            if (!this._buildMap)
                this._buildMap = {};
            this._buildMap[moduleName] = this.createModule(content, moduleName, parsedName);
        },

        load: function (moduleName, req, onLoad, config) {
            var self = this,
                parsedName = this.parseName(moduleName),
                url = req.toUrl(parsedName.file);
            
            fileLoader(url, function (content) {
                if (config.isBuild) {
                    self.saveModuleContent(content, moduleName, parsedName);
                    onLoad();
                }
                self.encodeContentAsync(content, moduleName, parsedName, onLoad);
            }, function (err) {
                if (onLoad.error) {
                    onLoad.error(err);
                }
            });
        },

        write: function (pluginName, moduleName, write, config) {
            if (this._buildMap && this._buildMap.hasOwnProperty(moduleName))
                write.asModule(pluginName + "!" + moduleName, this._buildMap[moduleName]);
        }
    };

    return text;
});
