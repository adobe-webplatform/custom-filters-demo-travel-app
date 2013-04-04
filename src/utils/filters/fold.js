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

define(["mobileui/utils/filter",
        "mobileui/utils/base64",
        "third-party/text!mobileui/utils/filters/shaders/fold.vert",
        "third-party/text!mobileui/utils/filters/shaders/fold.frag"], function(Filter, base64, vert, frag) {

    var header;
    function initHeader() {
        if (header)
            return;
        header = "custom(url(" + base64.url(vert) + ") mix(url(" + base64.url(frag) + ") overlay source-atop)";
    }

    return Filter.registerCustomFilter("fold", "width height startPosition currentPosition paddingHeight marginHeight segmentsY",
        function(fn) {
            initHeader();
            var distance = Math.min(0, fn._currentPosition - fn._startPosition),
                segYPixelRatio =  1 / fn._segmentsY / fn._paddingHeight;
            var result = header + ", " +
             "11 " + fn._segmentsY + " detached" +
             ", drag_distance " + (distance / fn._width).toFixed(6) +
             ", light_intensity 0.5" +
             ", padding_height " + (fn._paddingHeight * segYPixelRatio).toFixed(6) +
             ", margin_height " + (fn._marginHeight * segYPixelRatio).toFixed(6) +
             ", down_x " + (fn._startPosition / fn._width).toFixed(6) +
             ", transform translate3d(" + (distance / 2).toFixed(6) + "px, 0, 0)" +
             ")";

            return result;
    });
});