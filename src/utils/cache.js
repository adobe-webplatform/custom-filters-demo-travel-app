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

define(["mobileui/utils/boilerplate"], function(boilerplate) {

    var Cache = function() {
        this._cache = boilerplate.lookupPrefix(window, "applicationCache");
        if (!this._cache)
            return;
        this._cache.addEventListener("updateready", this._onCacheUpdateReady.bind(this));
    };

    _.extend(Cache.prototype, Backbone.Events, {
        _onCacheUpdateReady: function() {
            console.log("Cache: ", this._cache.status);
            if (this._cache.status != this._cache.UPDATEREADY) {
                console.log("No cache update.");
                return;
            }
            console.log("Update ready.");
            this.trigger("updateready");
        },

        swapCache: function() {
            console.log("Swapping cache.");
            this._cache.swapCache();
            console.log("Reloading app.");
            window.location.reload();
        },

        checkForUpdates: function() {
            if (!this._cache)
                return;
            try {
                this._cache.update();
            } catch (e) {
                // FIXME: Opera throws an INVALID_STATE_ERR.
            }
        }
    });

    return new Cache();

});