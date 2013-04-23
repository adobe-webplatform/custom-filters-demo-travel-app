define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/preloader',
        'helpers/tweenHelper'
    ],

    function(preloader, config, $, template, tweenHelper) {

        var SKIP_ANIMATION = false;

        var _container;
        var _percentWrapper;
        var _percentWrapperTweenObj = {};
        var _percent;
        var _callback;
        var _tweenObj = {percent: 0};

        var _transform3DStyle = config.transform3DStyle;

        function init(){
            _initVariables();
            _initEvents();

            $('#app').append(_container);
        }

        function _initVariables(){
            _container = $(template(config.data.preloader));
            _percentWrapper = _container.find('.percent-wrapper');
            _percent = _percentWrapper.find('.percent');
        }

        function _initEvents(){

        }

        function show(onStart, onLoaded) {
            _callback = onLoaded;
            onStart();
        }

        function onLoading(percent){
            tweenHelper.add(_tweenObj).to({percent: percent}, duration * 1000).easing( tweenHelper.Easing.Cubic.InOut).onUpdate(_onAnimate).start();
        }

        function _onAnimate(){
            var percent = _tweenObj.percent;
            _percent.html(percent * 100 | 0);
            if(percent == 1) {

                //TODO: animation
                _callback();
            }
        }

        function hide(){
            _container.hide();
        }

        preloader.init = init;
        preloader.show = show;
        preloader.onLoading = onLoading;
        preloader.hide = hide;

        return preloader;

    }

);
