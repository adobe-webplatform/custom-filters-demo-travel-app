define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/preloader',
        'EKTweener'
    ],

    function(preloader, config, $, template, EKTweener) {

        var SKIP_ANIMATION = false;

        var _container;
        var _percentWrapper;
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
            EKTweener.fromTo(_percentWrapper, SKIP_ANIMATION ? 0 : .2, {opacity: 0, transform3d: 'translate3d(0,10px,0)'}, {opacity: 1, transform3d: 'translate3d(0,0,0)', onComplete: function(){
                onStart();
            }});
        }

        function onLoading(percent){
            EKTweener.to(_tweenObj, SKIP_ANIMATION ? 0 : 1, {percent: percent, onUpdate: _onAnimate});
        }

        function _onAnimate(){
            var percent = _tweenObj.percent;
            _percent.html(percent * 100 | 0);
            if(percent == 1) {
                EKTweener.to(_percent, SKIP_ANIMATION ? 0 : .3, {transform3d: 'translate3d(0,-20px,0)', ease: 'easeOutCubic', onComplete: function(){
                    EKTweener.to(_percent, SKIP_ANIMATION ? 0 : .3, {transform3d: 'translate3d(0,50px,0)', ease: 'easeInCubic', onComplete: function(){
                        _callback();
                    }});
                }});
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
