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

define(['mobileui/utils/boilerplate', 'utils/default-settings'], 
    function(boilerplate, defaultSettings) {

    var localStorage = boilerplate.lookupPrefix(window, "localStorage"),
        storageKeyName = "settings";

    return _.extend({}, Backbone.Events, {
        init: function() {
            this._readStoredValues();
            this.trigger("ready");
        },

        getBoolean: function(name) {
            return this.readValue(name) == "true";
        },

        setBoolean: function(name, value) {
            this.writeValue(name, value ? "true" : "false");
        },

        readValue: function(name) {
            return this._settings[name];
        },

        writeValue: function(name, value) {
            this._internalWrite(name, value);
            this._setNeedsStoreUpdate();
        },

        _internalWrite: function(name, value) {
            this._settings[name] = value;
            this.trigger("change:" + name);
        },

        _needsStoreUpdate: false,

        _setNeedsStoreUpdate: function() {
            if (this._needsStoreUpdate)
                return;
            this._needsStoreUpdate = true;
            var self = this;
            setTimeout(function() {
                self._storeSettings();
            }, 0);
        },

        _settings: _.extend({}, defaultSettings),

        _readStoredValues: function() {
            var storedSettings = localStorage.getItem(storageKeyName);
            if (!storedSettings)
                return;
            try {
                storedSettings = JSON.parse(storedSettings);
            } catch (e) {}
            if (!storedSettings || !_.isObject(storedSettings)) {
                localStorage.removeItem(storageKeyName);
                return;
            }
            var self = this;
            _.each(storedSettings, function(value, key) {
                if (value == self._settings[key])
                    return;
                self._internalWrite(key, value);
            });
        },

        _storeSettings: function() {
            this._needsStoreUpdate = false;
            if (!localStorage)
                return;
            var settingsToStore = {};
            _.each(this._settings, function(value, key) {
                if (defaultSettings == value)
                    return;
                settingsToStore[key] = value;
            });
            localStorage.setItem(storageKeyName, JSON.stringify(settingsToStore));
        }
    });
});