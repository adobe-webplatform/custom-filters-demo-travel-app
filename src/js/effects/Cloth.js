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

        function Cloth(params){
            _super.constructor.call(this, DEFAULT_OPTS, mixIn({}, DEFAULT_PARAMS, params), getStyle);
        }

        var _super = Shader.prototype;
        var _p = Cloth.prototype = new Shader();
        _p.constructor = Cloth;

        var DEFAULT_OPTS = {
            blendMode: 'overlay source-atop',
            fragUrl: 'assets/shaders/cloth.frag',
            vertUrl: 'assets/shaders/cloth.vert',
            detached: true,
            segX: 40,
            segY: 20
        };

        var DEFAULT_PARAMS = {
            downX: .5,
            downY: 0,
            toX: .5,
            toY: 0,
            vX: 0,
            oX: 0,
            vY: 0,
            oY: 0,
            translateY: 0
        };

        function render(){
            var params = this.params;
            params.vX += (params.toX - params.oX);
            params.oX = (params.oX + params.vX) * .4;
            params.vY += (params.toY - params.oY);
            params.oY = (params.oY + params.vY) * .6;
        }

        function getStyle(opts) {
            var params = this.params;
            return this.header +
            ', downX ' + params.downX.toFixed(6) +
            ', downY ' + params.downY.toFixed(6) +
            ', toX ' + params.toX.toFixed(6) +
            ', toY ' + params.toY.toFixed(6) +
            ', oX ' + params.oX.toFixed(6) +
            ', oY ' + params.oY.toFixed(6) +

            // move half of the distance with shader and move the other half with csstransform3d
            ',translateY ' + (params.translateY / 2).toFixed(6) +
            ')';
        }

        _p.render = render;
        _p.getStyle = getStyle;

        return Cloth;

    }
);
