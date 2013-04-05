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
            segX: 20,
            segY: 20
        };

        var DEFAULT_PARAMS = {
            downX: 0,
            downY: 0,
            toX: 0,
            toY: 0,
            midEaseRatio: .1,
            gravity: .1
        };

        function render(){
            var params = this.params;
        }

        function getStyle(opts) {
            var params = this.params;
            return this.header +
            ', downX ' + params.downX.toFixed(6) +
            ', downY ' + params.downY.toFixed(6) +
            ', toX ' + params.toX.toFixed(6) +
            ', toY ' + params.toY.toFixed(6) +

            // move half of the distance with shader and move the other half with csstransform3d
            ', transform translate3d(0, 0, 0) '+
            ')';
        }

        _p.render = render;
        _p.getStyle = getStyle;

        return Cloth;

    }
);
