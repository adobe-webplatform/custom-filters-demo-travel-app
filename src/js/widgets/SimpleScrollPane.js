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
            this.isRendering = false;
            this.onUpdateCallback = null;

            this.deltaYLog = [];
            this.deltaTimeLog = [];
            this.deltaIndex = 0;
        }

        var _p = SimpleScrollPane.prototype;

        var LOG_MAX = 5;

        function init(){
            inputController.add(this.wrapper, 'down', bind(_onDown, this));
            inputController.onMove.add(_onMove, this);
            inputController.onUp.add(_onUp, this);
            window.test = this;
        }

        function _onDown(e){
            if(this.movableHeight < 1) return;
            this.isDown = true;
        }

        function _onMove(e){
            if(!this.isDown || !inputController.isScrollV || this.movableHeight < 1) return;
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
            if(!this.hasMoved || this.movableHeight < 1) return;
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
            this._moveToPos();

            if(!this.isDown) {
                if(this._ratio > 0) {
                    this._tRatio -= this._tRatio * this._boundEaseRatio;
                    this._tPos = this._tRatio * this.movableHeight;
                } else if(this._ratio < -1) {
                    this._tRatio += (-1 - this._tRatio) * this._boundEaseRatio;
                    this._tPos = this._tRatio * this.movableHeight;
                }
            }
            if(!this.isRendering && Math.abs(this._tPos - this._pos) > 1){
                this.isRendering = true;
                stageReference.onRender.add(render, this);
            } else if(Math.abs(this._tPos - this._pos) < 1) {
                this.isRendering = false;
                stageReference.onRender.remove(render, this);
            }
        }

        function moveToRatio(value, easeRatio) {
            this.moveToPos(value * this.movableHeight, easeRatio);
        }

        function moveToPos(value, easeRatio) {
            this._easeRatio = easeRatio === undef ? 1 : easeRatio;
            this._tPos = value;
            this._tRatio = this._tPos / (this.movableHeight > 0 ? this.movableHeight : 1);
            if(!this.isRendering) {
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
            elementStyle.top = 'translate(0,' + value + 'px)';
        };

        _p.init = init;
        _p._onDown = _onDown;
        _p._onUp = _onUp;
        _p.onResize = onResize;
        _p.render = render;
        _p.moveToRatio = moveToRatio;
        _p.moveToPos = moveToPos;
        _p._moveToPos = _moveToPos;
        _p._moveElementTo = _moveElementTo;


        return SimpleScrollPane;

    }
);
