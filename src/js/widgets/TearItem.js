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
        'inputController',
        'sectionController',
        'stageReference',
        'effects/Tear',
        'mout/function/bind',
        'mout/array/indexOf',
        'helpers/tweenHelper'
    ], function(config, $, inputController, sectionController, stageReference, Tear, bind, indexOf, tweenHelper){

        var undef;

        function TearItem(elem, onPeekCallback, onUnPeekCallback, onOpenCallback){
            this.elem = elem;
            this.onPeekCallback = onPeekCallback;
            this.onUnPeekCallback = onUnPeekCallback;
            this.onOpenCallback = onOpenCallback;

            this._init();
        }

        var _p = TearItem.prototype;

        var needRenderItems = TearItem.needRenderItems = [];

        var _isDownItems = [];
        var _isInitialized = false;
        var _hasMoved = false;

        var _filterStyle = config.filterStyle;

        function _init(){
            this.elemStyle = this.elem.style;
            this.$elem = $(this.elem);

            this.tear = new Tear({});
            this.tearParams = this.tear.params;
            this.isUsingFront = false;

            inputController.add(this.elem, 'down', bind(_onItemDown, this));

            if(!_isInitialized) {
                inputController.onMove.add(_onItemMove);
                inputController.onUp.add(_onItemUp);
                _isInitialized = true;
            }
        }

        function _onItemDown(e){
            if(!e.isMainPointer || sectionController.isAnimating() || this.isDown) return;
            this.isDown = true;
            var index = indexOf(_isDownItems, this);
            if(index > -1) return;

            _isDownItems.push(this);
            this.updateSize();
            var length;
            if(this.tearParams.isVertical) {
                length = e.y;
                this.isUsingFront = (length - this.$elem.offset().top) < this.$elem.height() / 2;
            } else {
                length = e.x;
                this.isUsingFront = (length - this.$elem.offset().left) < this.$elem.width() / 2;
            }
        }

        function _setRender(){
            if(indexOf(needRenderItems, this) > -1) return;
            var params = this.tear.params;
            this.elemStyle.zIndex = this.$elem.siblings().length + 100;
            needRenderItems.push(this);
            if(needRenderItems.length == 1 ) stageReference.onRender.add(_renderAll);
            this.render();
        }

        function resetShader(){
            var index = indexOf(needRenderItems, this);
            if(index > -1) {
                needRenderItems.splice(index, 1);
                if(needRenderItems.length === 0 ) stageReference.onRender.remove(_renderAll);
            }
            this.tearParams.distance = this.tearParams.prevDistance = this.tearParams.bounce = 0;
            this.elemStyle[_filterStyle] = 'none';
            this.elemStyle.zIndex = 'auto';
            this.hasPeeked = false;
            this.isDown = false;
        }

        function resetDown(){
            var index = indexOf(_isDownItems, this);
            if(index > -1) _isDownItems.splice(index, 1);
            if(needRenderItems.length === 0 ) stageReference.onRender.remove(_renderAll);
        }

        function setTo(distance){
            tweenHelper.kill(this.tearParams);
            this.tearParams.distance = distance;
            this._setRender();
        }

        function easeTo(distance, duration){
            var params = this.tearParams;
            if(params.distance === 0.0) {
                params.distance = 0.00001;
            } else if(params.distance ===1.0) {
                params.distance = 0.99999;
            }
            tweenHelper.add(this.tearParams).to({distance: distance}, duration * 1000).easing( tweenHelper.Easing.Sinusoidal.InOut).start();
            this._setRender();
        }

        function updateSize(isVertical) {
            var params = this.tearParams;
            if(isVertical !== undef) {
                params.isVertical = isVertical;
            }
            if(params.isVertical) {
                this.length = this.$elem.height();
                this.tear.updateHeader({segX: 6, segY: 8});
            } else {
                this.length = this.$elem.width();
                this.tear.updateHeader({segX: 8, segY: 6});
            }
        }

        function render(){
            var params = this.tearParams;
            if((params.distance > params.threshold) && (params.prevDistance < params.threshold)) {
                params.bounce = 1.0;
            }
            this.elemStyle[_filterStyle] = this.tear.getStyle();
            params.bounce *= -.75;
            params.prevDistance = params.distance;

            if(params.distance === 0) {
                if(this.hasPeeked && this.onUnPeekCallback) this.onUnPeekCallback();
                this.resetShader();
            } else if(params.distance === 1) {
                var index = indexOf(needRenderItems, this);
                if(index > -1) {
                    needRenderItems.splice(index, 1);
                    if(needRenderItems.length === 0 ) stageReference.onRender.remove(_renderAll);
                }
            }
        }

/**
 * STATIC FUNCTIONS
 */

        function _onItemMove(e){
            if(!e.isMainPointer) return;
            var isScrollV = inputController.isScrollV;
            var i = _isDownItems.length;
            var params, target, delta, isVertical, isUsingFront;
            while(i--) {
                target = _isDownItems[i];
                isVertical = target.tearParams.isVertical;
                if(isVertical == isScrollV){
                    params = target.tearParams;
                    delta = (isVertical ? e.deltaY : e.deltaX) / target.length;
                    if(isUsingFront = target.isUsingFront) delta *= -1;
                    if(!(params.distance == 0 && delta < 0)){
                        params.distance += delta;
                        if(!target.hasPeeked && params.distance > 0) {
                            if(target.onPeekCallback) target.onPeekCallback();
                            target.hasPeeked = true;
                        }
                        if(params.distance < 0) params.distance = 0;
                        target._setRender();
                    }
                }
            }
            _hasMoved = true;
        }

        function _onItemUp(e){
            if(sectionController.isAnimating() || !e.isMainPointer) return;
            var i = _isDownItems.length;
            var target;
            while(i--) {
                target = _isDownItems[i];
                if(target.onOpenCallback && target.tearParams.distance > target.tearParams.threshold) {
                    target.onOpenCallback();
                } else if(e.distance !== 0) {
                    target.easeTo(0, .3);
                    target.isDown = false;
                }
            }
            _isDownItems.length = 0;
            _hasMoved = false;
        }

        function _renderAll(){
            var params, target;
            var i = needRenderItems.length;
            while(i--) needRenderItems[i].render();
        }

        _p._init = _init;
        _p.resetShader = resetShader;
        _p._setRender = _setRender;
        _p.updateSize = updateSize;
        _p.resetDown = resetDown;
        _p.setTo = setTo;
        _p.easeTo = easeTo;
        _p.render = render;

        return TearItem;

    }
);
