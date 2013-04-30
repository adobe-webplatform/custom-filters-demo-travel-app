define('stageReference',
    [
        'exports',
        'signals',
        'edankwan/polyfill/rAF'
    ], function(stageReference, signals) {

        stageReference.windowWidth = 0;
        stageReference.windowHeight = 0;
        stageReference.stageWidth = 0;
        stageReference.stageHeight = 0;

        var onResize = new signals.Signal();
        var onRender = new signals.Signal();

        var rAFId = 0;

        // override onRender Signal
        onRender.add = function(args){
            signals.Signal.prototype.add.apply(onRender, arguments);
            if(onRender._bindings.length === 1) {
                _render();
            }
        };
        onRender.remove = function(args){
            signals.Signal.prototype.remove.apply(onRender, arguments);
            if(onRender._bindings.length === 0) {
                window.cancelAnimationFrame(rAFId);
            }
        };

        function init(){
            if('addEventListener' in window) {
                window.addEventListener( 'resize', onResize.dispatch, false );
                window.addEventListener( 'orientationchange', onResize.dispatch, false );
            }else{
                window.onresize = onResize.dispatch;
            }
            onResize.add(_onResize);
        }

        function _onResize(){
            if('innerWidth' in window) {
                stageReference.windowWidth = window.innerWidth;
                stageReference.windowHeight = window.innerHeight;
            } else if (document.documentElement) {
                stageReference.windowWidth = document.documentElement.clientWidth;
                stageReference.windowHeight = document.documentElement.clientHeight;
            } else {
                stageReference.windowWidth = document.body.clientWidth;
                stageReference.windowHeight = document.body.clientHeight;
            }
            stageReference.stageWidth = stageReference.windowWidth < stageReference.minWidth ? stageReference.minWidth : stageReference.windowWidth;
            stageReference.stageHeight = stageReference.windowHeight < stageReference.minHeight ? stageReference.minHeight : stageReference.windowHeight;
        }

        function _render(){
            rAFId = window.requestAnimationFrame(_render);
            onRender.dispatch();
        }

        stageReference.init = init;
        stageReference.onResize =  onResize;
        stageReference.onRender =  onRender;

        return stageReference;

    }
);
