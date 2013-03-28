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

define(["mobileui/utils/filter"], function(Filter) {

    return Filter.registerCustomFilter("fold", "t shadow width",
        function(fn) {
            var width = fn._width * fn._t / 3;
            return "custom(url(style/shaders/fold.vert) " +
             "mix(url(style/shaders/fold.frag) multiply source-atop), " +
             "6 1 detached, t " + fn._t.toFixed(6) + ", shadow " + fn._shadow.toFixed(6) +
             ", transform translate(" + (-width).toFixed(6) + "px, 0) perspective(1500) translate(" + (width).toFixed(6) +
             "px, 0), mapDepth 150)";
    });

});