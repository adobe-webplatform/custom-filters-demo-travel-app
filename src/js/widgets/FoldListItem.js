define([
        'config',
        'jquery',
        'inputController',
        'sectionController',
        'stageReference',
        'effects/Fold',
        'mout/function/bind',
        'mout/array/indexOf',
        'EKTweener'
    ], function(config, $, inputController, sectionController, stageReference, Fold, bind, indexOf, EKTweener){

        var undef;

        function FoldListItem(elem, onPeekCallback, onUnPeekCallback, onOpenCallback, shaderPadding){
            this.elem = elem;
            this.onPeekCallback = onPeekCallback;
            this.onUnPeekCallback = onUnPeekCallback;
            this.onOpenCallback = onOpenCallback;
            this.shaderPadding = shaderPadding;

            this._init();
        }

        var _p = FoldListItem.prototype;

        var needRenderItems = FoldListItem.needRenderItems = [];

        var _isDownItems = [];
        var _isInitialized = false;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;

        function _init(){
            this.elemStyle = this.elem.style;
            this.$elem = $(this.elem);
            this.shaderShadowStyle = this.$elem.find('.shader-shadow')[0].style;
            this.fold = new Fold({padding_height : this.shaderPadding});
            this.foldParams = this.fold.params;

            inputController.add(this.elem, 'down', bind(_onItemDown, this));

            if(!_isInitialized) {
                inputController.onMove.add(_onItemMove);
                inputController.onUp.add(_onItemUp);
                stageReference.onRender.add(_renderAll);
                _isInitialized = true;
            }
        }

        function _onItemDown(e){
            if(sectionController.isAnimating()) return;
            var index = indexOf(_isDownItems, this);
            if(index > -1) return;

            _isDownItems.push(this);
            this.updateSize();
            this.foldParams.down_x = e.x - this.foldParams.distance;
        }

        function _setRender(){
            if(indexOf(needRenderItems, this) > -1) return;
            var params = this.fold.params;
            var shaderStyle = this.shaderShadowStyle;
            shaderStyle.display = 'block';
            shaderStyle.top = shaderStyle.bottom =  '-' + params.margin_height + 'px';
            this.elemStyle.zIndex = 500;
            this.render();
            this.render();
            needRenderItems.push(this);
        }

        function resetShader(){
            var index = indexOf(needRenderItems, this);
            if(index > -1) needRenderItems.splice(index, 1);
            this.shaderShadowStyle.display = 'none';
            this.foldParams.distance = 0;
            this.elemStyle[_transform3DStyle] = 'translateZ(0)';
            this.elemStyle[_filterStyle] = 'none';
            this.elemStyle.zIndex = 'auto';
            this.hasPeeked = false;
        }

        function setTo(distance, downX){
            EKTweener.killTweensOf(this.foldParams);
            this.foldParams.distance = distance;
            if(downX !== undef) this.foldParams.down_x = downX;
            this._setRender();
        }

        function easeTo(distance, downX, duration){
            if(this.foldParams.distance == 0) this.foldParams.distance = .1;
            EKTweener.to(this.foldParams, duration, {distance: distance, down_x: downX, ease: 'easeInOutSine'});
            this._setRender();
        }

        function updateSize() {
            var itemWidth = this.$elem.width();
            var itemHeight = this.$elem.height();
            var segY = Math.ceil(itemHeight / this.shaderPadding) + 2;
            var params = this.foldParams;
            this.fold.updateHeader({segY: segY});
            params.width = itemWidth;
            params.height = itemHeight;
            params.padding_height = this.shaderPadding;
            params.margin_height = (segY * this.shaderPadding - itemHeight) / 2;
        }

        function render(){
            var params = this.foldParams;
            if(this.renderToggle ^= 1) {
                this.elemStyle[_filterStyle] = this.fold.getStyle();
            } else {
                this.elemStyle[_transform3DStyle] = 'translate3d(' + (params.distance / 2).toFixed(6) + 'px, 0, 0)';
            }
            if(params.distance === 0) {
                this.resetShader();
                this.onUnPeekCallback();
            }
        }

/**
 * STATIC FUNCTIONS
 */

        function _onItemMove(e){
            if(!inputController.isScrollH) return;
            var i = _isDownItems.length;
            var params;
            var target;
            while(i--) {
                target = _isDownItems[i];
                if(!target.hasPeeked) {
                    target.onPeekCallback();
                    target.hasPeeked = true;
                }
                params = target.foldParams;
                params.distance += e.deltaX;
                if(params.distance > 0) params.distance = 0;
                target._setRender();
            }
        }

        function _onItemUp(e){
            if(sectionController.isAnimating()) return;
            var i = _isDownItems.length;
            if(e.distanceX < -150) {
                while(i--) _isDownItems[i].onOpenCallback();
            } else {
                while(i--) _isDownItems[i].easeTo(0, .5, .3);
            }
            _isDownItems.length = 0;
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
        _p.setTo = setTo;
        _p.easeTo = easeTo;
        _p.render = render;

        return FoldListItem;

    }
);
