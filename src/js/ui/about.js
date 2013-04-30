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
        'hbs!templates/ui/about',
        'inputController',
        'uiController',
        'effects/Roll',
        'stageReference',
        'helpers/tweenHelper'
    ],

    function(about, config, $, template, inputController, uiController, Roll, stageReference, tweenHelper) {

        var _container;
        var _containerStyle;
        var _homeIcon;
        var _tabs;
        var _currentNodes = [];

        var _roll;
        var _isRendering = false;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;

        function init(){
            _container = $(template(config.data.about));
            _containerStyle = _container[0].style;
            $('#app').append(_container);
            _roll = new Roll({});

            uiController.onAboutShow.add(show);
            uiController.onAboutHide.add(hide);
        }

        function _render(){
            _containerStyle[_filterStyle] = _roll.getStyle();
        }

        function _updateShaderHeader(){
            var minSeg = 3;
            var screenRatio = stageReference.stageWidth / stageReference.stageHeight;
            var maxSeg = Math.ceil( screenRatio > 1 ?  minSeg * screenRatio : minSeg / screenRatio);
            _roll.updateHeader({segX: screenRatio > 1 ? maxSeg : minSeg, segY: screenRatio > 1 ? minSeg : maxSeg});
        }

        function show() {
            _updateShaderHeader();
            _container.show();
            tweenHelper.kill(_roll.params);
            _roll.params.t = 0;
            tweenHelper.add(_roll.params).to({t: 1}, 1200).easing( tweenHelper.Easing.Sinusoidal.Out).onComplete(function(){
                _stopRender();
            }).start();
            _startRender();
        }

        function hide() {
            _updateShaderHeader();
            tweenHelper.add(_roll.params).to({t: 0}, 1200).easing( tweenHelper.Easing.Sinusoidal.Out).onComplete(function(){
                _stopRender();
                _container.hide();
                uiController.onTaskKilled();
            }).start();
            _startRender();
        }

        function _startRender(){
            if(_isRendering) return;
            _isRendering = true;
            stageReference.onRender.add(_render);
        }

        function _stopRender(){
            if(!_isRendering) return;
            _isRendering = false;
            stageReference.onRender.remove(_render);
        }

        about.init = init;
        about.show = show;
        about.hide = hide;

        return about;

    }

);
