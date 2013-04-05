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

        var _isRendering = stageReference.isRendering = false;

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
            if(_isRendering) {
                window.requestAnimationFrame(_render);
                onRender.dispatch();
            }
        }

        function startRender() {
            _isRendering = stageReference.isRendering = true;
            _render();
        }

        function stopRender() {
            _isRendering = stageReference.isRendering = false;
        }

        function renderOnce (){
            onRender.dispatch();
        }

        stageReference.init = init;
        stageReference.onResize =  onResize;
        stageReference.onRender =  onRender;
        stageReference.startRender = startRender;
        stageReference.stopRender = stopRender;
        stageReference.renderOnce = renderOnce;

        return stageReference;

    }
);