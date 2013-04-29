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
        'mout/function/bind',
        'stageReference'
    ], function(config, $, inputController, bind, stageReference){

        var undef;

        var _transform3DStyle = config.transform3DStyle;
        var _transformStyle = config.transformStyle;

        function SimpleScrollPane(wrapper, moveContainer, indicator){
            this.wrapper = wrapper;
            this.moveContainer = moveContainer;
            this.moveContainerStyle = moveContainer[0].style;
            this.indicator = indicator;
            this.indicatorStyle = indicator[0].style;

            this._tPos = 0;
            this._tRatio = 0;
            this._pos = 0;
            this._ratio = 0;
            this._easeRatio = 1;
            this._boundEaseRatio = .4;
            this._momentumEaseRatio = .08;
            this._isRendering = false;

            this.isBound = false;
            this.onUpdateCallback = null;

            this.deltaYLog = [];
            this.deltaTimeLog = [];
            this.deltaIndex = 0;

            this._isActive = true;
        }

        var _p = SimpleScrollPane.prototype;

        var LOG_MAX = 5;

        function init(){
            inputController.add(this.wrapper, 'down', bind(_onDown, this));
            inputController.onMove.add(_onMove, this);
            inputController.onUp.add(_onUp, this);
        }

        function _onDown(e){
            if(!this._isActive || this.movableHeight < 1) return;
            this.isDown = true;
        }

        function _onMove(e){
            if(!this._isActive || !this.isDown || !inputController.isScrollV || this.movableHeight < 1) return;
            if(!this.hasMoved) {
                this.deltaYLog = [];
                this.deltaTimeLog = [];
                this.deltaIndex = 0;
            }
            this.deltaYLog[this.deltaIndex] = e.deltaY;
            this.deltaTimeLog[this.deltaIndex++] = e.deltaTime;
            if(this.deltaIndex == LOG_MAX - 1) this.deltaIndex = 0;
            this.hasMoved = true;
            this.moveToPos(this._tPos + e.deltaY, .5);
        }

        function _onUp(e){
            if(!this._isActive || !this.hasMoved || this.movableHeight < 1) return;
            this.isDown = false;
            this.hasMoved = false;
            var deltaY = e.deltaY;
            var deltaTime = e.deltaTime;
            var i = Math.max(this.deltaIndex, this.deltaYLog.length);
            while(i--) {
                deltaY += this.deltaYLog[i];
                deltaTime += this.deltaTimeLog[i];
            }
            var pos = this._tPos + deltaY / deltaTime * 200;
            this.moveToPos(pos, this._momentumEaseRatio);
        }

        function onResize(){
            this.visibleHeight = this.wrapper.height();
            this.height = this.moveContainer.height();
            this.movableHeight = Math.max(0, this.height - this.visibleHeight);
            this.indicatorHeight = Math.min(1, this.visibleHeight / this.height) * this.visibleHeight;
            this.movableIndicatorHeight = this.visibleHeight - this.indicatorHeight;
            this.indicator.height(this.indicatorHeight);
            this.moveToRatio(this._tRatio, 1);
        }

        function render(){
            this._pos += (this._tPos - this._pos) * this._easeRatio;
            this._ratio = this._pos / this.movableHeight;

            if(!this.isDown && !this.isBound) {
                if(this._ratio > 0) {
                    this._tRatio -= this._tRatio * this._boundEaseRatio;
                    this._tPos = this._tRatio * this.movableHeight;
                } else if(this._ratio < -1) {
                    this._tRatio += (-1 - this._tRatio) * this._boundEaseRatio;
                    this._tPos = this._tRatio * this.movableHeight;
                }
            }

            if(this.isBound) this._bound();

            if(!this._isRendering && Math.abs(this._tPos - this._pos) > 1){
                this._isRendering = true;
                stageReference.onRender.add(render, this);
            } else if(~~Math.abs(this._tPos - this._pos) < 1) {
                if(!this.isDown) this._bound();
                this._pos = ~~this._tPos;
                this._isRendering = false;
                stageReference.onRender.remove(render, this);
            }
            this._moveToPos();
            if(this.onUpdateCallback) this.onUpdateCallback(this._pos, this._ratio);
        }

        function _bound(){
            if(this._ratio > 0) {
                this._pos = this._tPos = this._ratio = this._tRatio = 0;
            } else if(this._ratio < -1) {
                this._ratio = this._tRatio = -1;
                this._pos = this._tPos = this._tRatio * this.movableHeight;
            }
        }

        function moveToRatio(value, easeRatio) {
            this.moveToPos(value * this.movableHeight, easeRatio);
        }

        function moveToPos(value, easeRatio) {
            this._easeRatio = easeRatio === undef ? 1 : easeRatio;
            this._tPos = value;
            this._tRatio = this._tPos / (this.movableHeight > 0 ? this.movableHeight : 1);
            if(!this._isRendering) {
                this.render();
            }
        }

        function _moveToPos() {
            this._moveElementTo(this.moveContainerStyle, this._pos);
            this._moveElementTo(this.indicatorStyle, this.movableIndicatorHeight * -this._ratio);
        }

        var _moveElementTo = _transform3DStyle ? function (elementStyle, value) {
            elementStyle[_transform3DStyle] = 'translate3d(0,' + value + 'px,0)';
        } :_transformStyle ? function (elementStyle, value) {
            elementStyle[_transformStyle] = 'translate(0,' + value + 'px)';
        }: function(elementStyle, value) {
            elementStyle.top = value + 'px';
        };

        function setActive(bool){
            this._isActive = bool;
            this.isDown = false;
        }

        _p.init = init;
        _p._onDown = _onDown;
        _p._onUp = _onUp;
        _p.onResize = onResize;
        _p._bound = _bound;
        _p.render = render;
        _p.moveToRatio = moveToRatio;
        _p.moveToPos = moveToPos;
        _p._moveToPos = _moveToPos;
        _p._moveElementTo = _moveElementTo;


        return SimpleScrollPane;

    }
);
