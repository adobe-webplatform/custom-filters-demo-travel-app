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
