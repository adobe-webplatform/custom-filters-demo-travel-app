define([
        './Shader',
        'mout/object/mixIn'
    ], function(Shader, mixIn){

        function Fold(params){
            _super.constructor.call(this, DEFAULT_OPTS, mixIn({}, DEFAULT_PARAMS, params), getStyle);
            this.ajaxShaders();
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
