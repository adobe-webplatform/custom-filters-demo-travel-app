define([
        'jquery',
        'mout/object/mixIn'
    ], function($, mixIn){

        function Shader(opts, params, getStyle){
            this._opts = mixIn({}, DEFAULT_OPTS, opts);
            this.header = '';
            this.params = params || {};
            this.updateHeader();
            this.getStyle = getStyle || this._defaultGetStyle;
        }

        var _p = Shader.prototype;
        var IS_DEV = true;
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

        function ajaxShaders(){
            $.ajax({url: _parseShaderUrl(this._opts.vertUrl)});
            $.ajax({url: _parseShaderUrl(this._opts.fragUrl)});
        }

        function _parseShaderUrl(url) {
            return url + (IS_DEV && url.indexOf('data:') !== 0 ? BUST : '');
        }

        function updateHeader(opts) {
            opts = mixIn(this._opts, opts);
            this.header = 'custom(url(' + _parseShaderUrl(opts.vertUrl) + ') mix(url('  + _parseShaderUrl(opts.fragUrl) + ') ' + opts.blendMode + '), ' + opts.segX + ' ' + opts.segY + ' ' + (opts.detached ? 'detached' : '');
        }

        _p._defaultGetStyle = _defaultGetStyle;
        _p.updateHeader = updateHeader;
        _p.ajaxShaders = ajaxShaders;

        return Shader;

    }
);
