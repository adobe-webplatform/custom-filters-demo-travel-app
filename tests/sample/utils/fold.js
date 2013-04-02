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

    return Filter.registerCustomFilter("fold", "width height startPosition currentPosition paddingHeight marginHeight segmentsY",
        function(fn) {
            var distance = Math.min(0, fn._currentPosition - fn._startPosition),
                segYPixelRatio =  1 / fn._segmentsY / fn._paddingHeight;
            var result = "custom(url(style/shaders/fold.vert) " +
             "mix(url(style/shaders/fold.frag) overlay source-atop), " +
             "11 " + fn._segmentsY + " detached" +
             ", distance " + (distance / fn._width).toFixed(6) +
             ", light_intensity 0.5" +
             ", padding_height " + (fn._paddingHeight * segYPixelRatio).toFixed(6) +
             ", margin_height " + (fn._marginHeight * segYPixelRatio).toFixed(6) +
             ", down_x " + (fn._startPosition / fn._width).toFixed(6) +
             ", transform translate3d(" + (distance / 2).toFixed(6) + "px, 0, 0)" +
             ")";

            return result;
    });
});