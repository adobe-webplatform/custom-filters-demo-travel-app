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
    
    
    function generateWarpArray(points) {
        var controlPoints = [];
        for (var i = 0; i < points.length; ++i) {
            var l = points[i].length;
            for (var j = 0; j < l; ++j) {
                var p = points[i][j];
                controlPoints.push(p[0].toFixed(6));
                controlPoints.push(p[1].toFixed(6));
                controlPoints.push(p[2].toFixed(6));
            }
        }
        return controlPoints.join(", ");
    }
    
    function generateWarpPoints(startX, startY, y) {
        var l = -0.5,
            t = -0.5,
            w = 1,
            h = y; // height

        var countX = 4;
        var countY = 4;
    
        var hW = w  / (countX - 1);
        var hH = h / (countY - 1);
    
        var k = [];
        for (var j = 0; j < countY; ++j) {
            var row = []; 
            for (var i = 0; i < countX; ++i)
                row.push([i * hW + l, j * hH + t, 0]);
            k.push(row);
        }
        
        return k;
    }

    return Filter.registerCustomFilter("warp", "shadow startX startY y",
        function(fn) {
            var points = generateWarpPoints(fn._startX, fn._startY , fn._y);
            return "custom(url(style/shaders/warp.vert) " +
             "mix(url(style/shaders/warp.frag) multiply source-atop), " +
             "10 10, k array(" + generateWarpArray(points) + "), " +
             "matrix perspective(1000), useColoredBack 0, backColor 1 1 1 1)";
    });

});