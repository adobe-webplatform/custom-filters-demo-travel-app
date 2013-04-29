/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Adobe System Incorporated
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 define([
        './Shader',
        'mout/object/mixIn'
    ], function(Shader, mixIn){

        function Fold(params){
            _super.constructor.call(this, DEFAULT_OPTS, mixIn({}, DEFAULT_PARAMS, params), getStyle);
        }

        var _super = Shader.prototype;
        var _p = Fold.prototype = new Shader();
        _p.constructor = Fold;

        var DEFAULT_OPTS = {
            blendMode: 'overlay source-atop',
            fragUrl: 'assets/shaders/fold.frag',
            vertUrl: 'assets/shaders/fold.vert',
            detached: true,
            segX: 11,
            segY: 10
        };

        var DEFAULT_PARAMS = {
            distance: 0,
            light_intensity: .5,
            padding_height: 20,
            margin_height: 20,
            down_x: 0
        };

        function getStyle(opts) {
            var params = this.params;
            return this.header +
            ', t ' + params.distance.toFixed(6) +
            ', light_intensity ' + params.light_intensity.toFixed(6) +
            ', padding_height ' + params.padding_height.toFixed(6) +
            ', margin_height ' + params.margin_height.toFixed(6) +
            ', down_x ' + params.down_x.toFixed(6) +

            // move half of the distance with shader and move the other half with csstransform3d
            ', transform translate3d(' + (params.distance / 2).toFixed(6) + 'px, 0, 0) '+
            ')';
        }

        _p.getStyle = getStyle;

        return Fold;

    }
);
