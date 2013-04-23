define([
        'exports',
        'config',
        'TWEEN',
        'mout/object/mixIn'
    ],
    function( tweenHelper, config, TWEEN, mixIn){

        var undef;

        var _transform3DStyle = config.transform3DStyle;

        function add(obj) {
            kill(obj);
            obj.__tween =  new TWEEN.Tween(obj);
            return obj.__tween;
        }

        function kill(obj) {
            if(obj.__tween) {
                TWEEN.remove(obj.__tween);
                obj.__tween = undef;
            }
        }

        function addDom(dom, defaultValues) {
            kill(dom);
            dom.__tweenObj = dom.__tweenObj || {};
            if(!dom.__tweenObj.__dom) dom.__tweenObj.__dom = dom;
            if(defaultValues) mixIn(dom.__tweenObj, defaultValues);
            dom.__tween =  new TWEEN.Tween(dom.__tweenObj);
            return dom.__tween;
        }

        function translateXY3DCallback(){
            this.__dom.style[_transform3DStyle] = 'translate3d(' + (this.x | 0) + 'px,' + (this.y | 0) + 'px,0)';
        }


        tweenHelper.add = add;
        tweenHelper.addDom = addDom;
        tweenHelper.kill = kill;
        tweenHelper.Easing = TWEEN.Easing;

        tweenHelper.translateXY3DCallback = translateXY3DCallback;

        return tweenHelper;

    }

);
