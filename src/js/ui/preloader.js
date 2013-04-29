/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Adobe System Incorporated
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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

        var _container;
        var _wrapper;
        var _wrapperStyle;
        var _blocks;
        var _leftBlockStyle;
        var _rightBlockStyle;
        var _line;
        var _lineStyle;
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

        var SKIP_ANIMATION = false;

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
            _leftBlockStyle = _blocks.filter('.left')[0].style;
            _rightBlockStyle = _blocks.filter('.right')[0].style;
            _line = _blocks.find('.line');
            _lineStyle = _line[0].style;
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
            tweenHelper.add(_tweenObj).to({percent: percent}, SKIP_ANIMATION ? 0 : 1500).easing( tweenHelper.Easing.Cubic.InOut).onUpdate(_onAnimate).start();
        }

        function _onAnimate(){
            var percent = _tweenObj.percent;
            _yearMarks[0].style[_transform3DStyle] = 'translate3d(0,' + ((1 - percent) * -50) + 'px,0) scale3d(' + (.7 + percent * .3) + ',' + (.7 + percent * .3) + ',0)';
            _yearMarks[1].style[_transform3DStyle] = 'translate3d(0,' + ((1 - percent) * 50) + 'px,0) scale3d(' + (1.3 - percent * .3) + ',' + (1.3 - percent * .3) + ',0)';
            _lineStyle.height = (percent * 100) + '%';
            _years.html(percent * YEAR | 0);
            if(percent == 1) {
                _lineStyle.bottom = 'auto';
                _lineStyle.top = 0;
                tweenHelper.add({}).to({}, SKIP_ANIMATION ? 0 :500).easing( tweenHelper.Easing.Cubic.InOut).onUpdate(function(t){
                    _lineStyle.height = ((1 - t) * 100) + '%';
                }).start();
                tweenHelper.add({}).delay(SKIP_ANIMATION ? 0 : 500).to({}, SKIP_ANIMATION ? 0 :1500).easing( tweenHelper.Easing.Cubic.InOut).onUpdate(_onHiding).start();
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
