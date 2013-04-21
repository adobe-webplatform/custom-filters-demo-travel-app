define([
        './Shader',
        'mout/object/mixIn'
    ], function(Shader, mixIn){

        function Roll(params){
            _super.constructor.call(this, DEFAULT_OPTS, mixIn({}, DEFAULT_PARAMS, params), getStyle);
        }

        var _super = Shader.prototype;
        var _p = Roll.prototype = new Shader();
        _p.constructor = Roll;

        var DEFAULT_OPTS = {
            blendMode: 'overlay source-atop',
            fragUrl: 'assets/shaders/roll.frag',
            vertUrl: 'assets/shaders/roll.vert',
            detached: true,
            segX: 4,
            segY: 3
        };

        var DEFAULT_PARAMS = {
            distance: 0,
            x: 1,
            y: 0,
            t: 0,
            perspective: 800
        };

        function getStyle(opts) {
            var params = this.params;
            return this.header +
            ', t ' + params.t.toFixed(6) +
            ',transform perspective(' + params.perspective.toFixed(6) + ')' +
            ')';
        }

        _p.getStyle = getStyle;

        return Roll;

    }
);
