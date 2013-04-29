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
        'config',
        'jquery',
        'mout/object/mixIn'
    ], function(config, $, mixIn){

        function Shader(opts, params, getStyle){
            this._opts = mixIn({}, DEFAULT_OPTS, opts);
            this.header = '';
            this.params = params || {};
            this.updateHeader();
            this.getStyle = getStyle || this._defaultGetStyle;

            if(!_hasCachedShaders[this._opts.vertUrl] || !_hasCachedShaders[this._opts.fragUrl]) {
                this._cacheShaders();
            }
        }

        var _p = Shader.prototype;
        var IS_DEV = true;
        var _dummy = $('<div style="width:0;height:0;"></div>')[0];
        var _filterStyle = config.filterStyle;
        var _hasCachedShaders = {};

        var BUST = '?v=' + (+new Date);

        var DEFAULT_OPTS = {
            blendMode: 'normal source-atop',
            fragUrl: 'data:text/plain;base64,',
            vertUrl: 'data:text/plain;base64,',
            detached: false,
            segX: 10,
            segY: 10
        };

        function _defaultGetStyle(){
            return this.header + ')';
        }

        function _cacheShaders(){
            this.updateHeader();
            _dummy.style[_filterStyle] += this.header + ')';
            _hasCachedShaders[this._opts.vertUrl] = _hasCachedShaders[this._opts.fragUrl] = true;
        }

        function _isDataUrl(url) {
            return url.indexOf('data:') === 0;
        }

        function _parseShaderUrl(url) {
            return url + (IS_DEV && !_isDataUrl ? BUST : '');
        }

        function updateHeader(opts) {
            opts = mixIn(this._opts, opts);
            this.header = 'custom(url(' + _parseShaderUrl(opts.vertUrl) + ') mix(url('  + _parseShaderUrl(opts.fragUrl) + ') ' + opts.blendMode + '), ' + opts.segX + ' ' + opts.segY + ' ' + (opts.detached ? 'detached' : '');
        }

        $(document).ready(function() {
            $('body').append(_dummy);
        });

        _p._defaultGetStyle = _defaultGetStyle;
        _p.updateHeader = updateHeader;
        _p._cacheShaders = _cacheShaders;

        return Shader;

    }
);
