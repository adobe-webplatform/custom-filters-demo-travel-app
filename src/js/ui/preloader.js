define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/preloader',
        'helpers/tweenHelper',
        'stageReference'
    ],

    function(preloader, config, $, template, tweenHelper, stageReference) {

        var SKIP_ANIMATION = false;

        var _container;
        var _wrapper;
        var _wrapperStyle;
        var _blocks;
        var _leftBlockStyle;
        var _rightBlockStyle;
        var _yearMarks;
        var _yearMarkStyles;
        var _yearWrappers;
        var _yearWrapperStyles;
        var _years;
        var _callback;
        var _tweenObj = {percent: 0};

        var _blockStyle;

        var _tearItem;
        var _isHiding = false;

        var YEAR = (new Date()).getFullYear();

        var _transform3DStyle = config.transform3DStyle;

        function init(){
            _initVariables();
            _initEvents();
            _onResize();

            $('#app').append(_container);
        }

        function _initVariables(){
            _container = $(template(config.data.preloader));
            _wrapper = _container.find('.wrapper');
            _wrapperStyle = _wrapper[0].style;
            _blocks = _wrapper.find('.block');
            _leftBlockStyle = _blocks[0].style;
            _rightBlockStyle = _blocks[1].style;
            _yearMarks = _container.find('.year-mask');
            _yearWrappers = _yearMarks.find('.year-wrapper');
            _years = _yearWrappers.find('.year');
        }

        function _initEvents(){
            stageReference.onResize.add(_onResize);
        }

        function _onResize(){
            var stageWidth = stageReference.stageWidth;
            var stageHeight = stageReference.stageHeight;
            var distance = Math.sqrt(stageWidth * stageWidth + stageHeight * stageHeight);
            var angle = Math.atan2(stageWidth, stageHeight);
            _wrapper[0].style[_transform3DStyle] = 'rotateZ(' + angle + 'rad)';
            _yearWrappers[0].style[_transform3DStyle] = _yearWrappers[1].style[_transform3DStyle] = 'rotateZ(' + (-angle) + 'rad)';
            if(!_isHiding) _blockStyle = 'scale3d(' + (distance / stageWidth) + ',' + (distance / stageHeight) + ',1)';
            _leftBlockStyle[_transform3DStyle] = _rightBlockStyle[_transform3DStyle] = _blockStyle;
        }

        function show(onStart, onLoaded) {
            _callback = onLoaded;
            onStart();
        }

        function onLoading(percent){
            tweenHelper.add(_tweenObj).to({percent: percent}, 1500).easing( tweenHelper.Easing.Cubic.InOut).onUpdate(_onAnimate).start();
        }

        function _onAnimate(){
            var percent = _tweenObj.percent;
            _yearMarks[0].style[_transform3DStyle] = 'translate3d(0,' + ((1 - percent) * -10) + 'px,0) scale3d(' + (.8 + percent * .2) + ',' + (.8 + percent * .2) + ',0)';
            _yearMarks[1].style[_transform3DStyle] = 'translate3d(0,' + ((1 - percent) * 10) + 'px,0) scale3d(' + (1.2 - percent * .2) + ',' + (1.2 - percent * .2) + ',0)';
            _years.html(percent * YEAR | 0);
            if(percent == 1) {
                tweenHelper.add({}).to({}, 1500).easing( tweenHelper.Easing.Cubic.InOut).onUpdate(_onHiding).start();
                _callback();
            }
        }

        function _onHiding(t) {
            _years[0].style[_transform3DStyle] = 'translate3d('+ (t * 100) + 'px,0,0)';
            _years[1].style[_transform3DStyle] = 'translate3d('+ (t * -100) + 'px,0,0)';
            _years[0].style.opacity = _years[1].style.opacity = 1 - t;
            _leftBlockStyle[_transform3DStyle] = _blockStyle + 'translate3d(' + (t * - 100) + '%,0,0)';
            _rightBlockStyle[_transform3DStyle] = _blockStyle + 'translate3d(' + (t * 100) + '%,0,0)';
            if(t == 1) {
                stageReference.onResize.remove(_onResize);
                hide();
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
