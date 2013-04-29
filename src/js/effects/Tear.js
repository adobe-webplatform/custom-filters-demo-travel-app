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

        function Tear(params){
            _super.constructor.call(this, DEFAULT_OPTS, mixIn({}, DEFAULT_PARAMS, params), getStyle);
        }

        var _super = Shader.prototype;
        var _p = Tear.prototype = new Shader();
        _p.constructor = Tear;

        var DEFAULT_OPTS = {
            blendMode: 'overlay source-atop',
            fragUrl: 'assets/shaders/tear.frag',
            vertUrl: 'assets/shaders/tear.vert',
            detached: true,
            segX: 1,
            segY: 1
        };

        var DEFAULT_PARAMS = {
            prevDistance: 0,
            distance: 0,
            down: 0,
            threshold: .15,
            bounce: 0,
            isVertical: 0
        };

        function getStyle(opts) {
            var params = this.params;
            //var segRatio =  1 / (params.isVertical ? this._opts.segY : this._opts.segX) / params.padding;
            return this.header +
            ', t ' + (params.distance).toFixed(6) +
            ', threshold ' + params.threshold +
            ', bounce ' + params.bounce.toFixed(6) +
            ', isVertical ' + (params.isVertical ? 1 : 0) +
            ')';
        }

        _p.getStyle = getStyle;

        return Tear;

    }
);
