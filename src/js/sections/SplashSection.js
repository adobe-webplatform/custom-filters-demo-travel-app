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
 define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/splash',
        'inputController',
        'sectionController',
        'effects/Cloth',
        'mout/function/bind',
        'stageReference',
        'helpers/tweenHelper'
    ], function(config, $, AbstractSection, template, inputController, sectionController, Cloth, bind, stageReference, tweenHelper){

        var undef;

        function SplashSection(){
            _super.constructor.call(this, 'splash', template);

            this.init();
            this._initVariables();
            this._initEvents();

            this.isFirstTime = true;
            this.isRendering = false;
        }

        var _super = AbstractSection.prototype;
        var _p = SplashSection.prototype = new AbstractSection();
        _p.constructor = SplashSection;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;
        var _renderToggle = 0;

        function _initVariables(){
            this.containerStyle = this.container[0].style;
            this.cloth = new Cloth({});
            this.boundRender = bind(_render, this);
        }

        function _initEvents(){
            inputController.add(this.container, 'down', bind(_onDown, this));
            inputController.add(this.container, 'click', bind(_onClick, this));
            stageReference.onResize.add(_onResize, this);
            this._onResize();
        }

        function _onClick(e){
            sectionController.goTo('home');
        }

        function _onDown(e){
            if(this.isDown || sectionController.isAnimating()) return; // ignore multitouch
            e.preventDefault();
            var params = this.cloth.params;
            tweenHelper.kill(params);
            params.downX =  params.toX = e.x / this.width;
            params.downY = params.toY = e.y / this.height;
            params.vX = 0;
            params.vY = 0;
            this.isDown = true;
            this._startRender();
            sectionController.appearTarget('home');
        }

        function _onMove(e){
            if(!this.isDown || sectionController.isAnimating()) return;
            e.preventDefault();
            var params = this.cloth.params;
            params.toX = e.x / this.width;
            params.toY = e.y / this.height;
            var dx = params.toX - params.downX;
            var dy = params.toY - params.downY;
        }

        function _onUp(e){
            if(!this.isDown || sectionController.isAnimating()) return;
            this.isDown = false;
            if(e.distanceY < -100) {
                sectionController.goTo('home');
            } else {
                var self = this;
                var params = this.cloth.params;
                tweenHelper.add(params).to({toX: params.downX, toY: 1, downY: 1}, 500).easing( tweenHelper.Easing.Elastic.InOut).onComplete(function(){
                    self._stopRender();
                }).start();
            }
        }

        function _render(){
            this.cloth.render();
            if((sectionController.isAnimating() && (_renderToggle ^= 1)) || !sectionController.isAnimating()) {
                this.containerStyle[_filterStyle] = this.cloth.getStyle();
            } else {
                this.containerStyle[_transform3DStyle] = 'translate3d(0,-' + (this.cloth.params.translateY / 2) + '%,0)';
            }
        }

        function _onResize(){
            this.width = stageReference.stageWidth;
            this.height = stageReference.stageHeight;
        }

        function show(currentNodes, previousSection, previousNodes){
            this.container.show();
            this._startRender();
            inputController.onMove.add(_onMove, this);
            inputController.onUp.add(_onUp, this);
            var params = this.cloth.params;
            if(!previousSection || previousNodes.length < 0) {
                params.toY = 1;
                params.downY = 1;
                if(sectionController.isFirstRoute) {
                    this.container.addClass('intro');
                    setTimeout(bind(function(){
                        this.container.removeClass('intro');
                        setTimeout(bind(_setShown, this), 3000);
                    }, this));
                } else {
                    setTimeout(bind(_setShown, this));
                }
            } else {
                params.toY = 0;
                params.downY = 1;
                params.translateY = - .25;//-stageReference.stageHeight / 4;
                this._renderToggle = 0;
                this._render();

                tweenHelper.add(params).to({toY: 1, translateY: 0}, 800).easing( tweenHelper.Easing.Cubic.Out).onComplete(bind(_setShown, this)).start();
            }
        }

        function _setShown(){
            this.container.addClass('show');
            this._stopRender();
            var self = this;
            // in Chrome Canary v28, the custom filter won't work probably on the children with transform 3d.
            this.container.find('.splash-bg, .splash-container, .splash-container .title').css(_transform3DStyle, 'none');
            this.isFirstTime = false;
            setTimeout(function(){
                // in Chrome Canary v28, the custom filter won't work probably on the children with transform 3d.
                self.container.find('*').css(_transform3DStyle, 'none');
            }, 400);
            _super._setShown.call(this);
        }

        function hide(currentSection, currentNodes){
            var self = this;
            this._startRender();
            inputController.onMove.remove(_onMove, this);
            inputController.onUp.remove(_onUp, this);
            var params = this.cloth.params;
            tweenHelper.add(params).to({toY: 0, downY: 1, translateY: -.25}, 800).easing( tweenHelper.Easing.Cubic.Out).onComplete(function(){
                self._stopRender();
                self.container.hide();
                self._setHidden();
            }).start();
        }

        function _startRender(){
            if(this.isRendering) return;
            this.isRendering = true;
            stageReference.onRender.add(_render, this);
        }

        function _stopRender(){
            if(!this.isRendering) return;
            this.isRendering = false;
            stageReference.onRender.remove(_render, this);
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._onResize = _onResize;
        _p._render = _render;
        _p.show = show;
        _p._setShown = _setShown;
        _p.hide = hide;
        _p._startRender = _startRender;
        _p._stopRender = _stopRender;


        return SplashSection;
    }
)
