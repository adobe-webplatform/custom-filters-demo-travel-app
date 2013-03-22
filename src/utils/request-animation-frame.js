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

    var requestAnimationFrame = boilerplate.lookupPrefix(window, "requestAnimationFrame");
    if (!requestAnimationFrame) {
        requestAnimationFrame = function(fn) {
            return setTimeout(fn, 0);
        };
    }

    var requestedCallbacks = null;
    var hadDOMUpdates = false;

    var fn = _.extend(function(callback) {
        if (!requestedCallbacks) {
            requestedCallbacks = [];
            requestAnimationFrame(update);
        }
        if (callback)
            requestedCallbacks.push(callback);
    }, Backbone.Events, {
        run: function() {
            fn(null);
        },
        setHadDOMUpdates: function() {
            hadDOMUpdates = true;
        },
        runInlinesIfNeeded: function() {
            if (hadDOMUpdates)
                update();
        }
    });

    function update() {
        fn.trigger("layout");
        fn.trigger("animation");
        while (requestedCallbacks && requestedCallbacks.length) {
            var callbacks = requestedCallbacks;
            requestedCallbacks = null;
            _.each(callbacks, function(fn) {
                fn();
            });
        }
        hadDOMUpdates = false;
        fn.trigger("after");
    }

    return fn;
});