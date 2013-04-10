define([
        'config',
        'jquery',
        'inputController',
        'sectionController',
        'stageReference',
        'effects/Tear',
        'mout/function/bind',
        'mout/array/indexOf',
        'EKTweener'
    ], function(config, $, inputController, sectionController, stageReference, Tear, bind, indexOf, EKTweener){

        var undef;

        function TearItem(elem, onPeekCallback, onUnPeekCallback, onOpenCallback, shaderPadding){
            this.elem = elem;
            this.onPeekCallback = onPeekCallback;
            this.onUnPeekCallback = onUnPeekCallback;
            this.onOpenCallback = onOpenCallback;
            this.shaderPadding = shaderPadding;

            this._init();
        }

        var _p = TearItem.prototype;

        var needRenderItems = TearItem.needRenderItems = [];

        var _isDownItems = [];
        var _isInitialized = false;

        var _filterStyle = config.filterStyle;

        function _init(){
            this.elemStyle = this.elem.style;
            this.$elem = $(this.elem);
            this.shaderShadowStyle = this.$elem.find('.shader-shadow')[0].style;
            this.tear = new Tear({padding : this.shaderPadding});
            this.tearParams = this.tear.params;
            this.isUsingFront = false;

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
            var shaderStyle = this.shaderShadowStyle;
            if(indexOf(needRenderItems, this) > -1 && shaderStyle.display == 'block') return;
            var params = this.tear.params;
            shaderStyle.display = 'block';
            if(params.isVertical) {
                shaderStyle.top = shaderStyle.bottom =  '-' + params.margin + 'px';
            } else {
                shaderStyle.left = shaderStyle.right =  '-' + params.margin + 'px';
            }
            this.elemStyle.zIndex = 500;
            this.render();
            needRenderItems.push(this);
        }

        function resetShader(){
            var index = indexOf(needRenderItems, this);
            if(index > -1) needRenderItems.splice(index, 1);
            this.shaderShadowStyle.display = 'none';
            this.tearParams.distance = 0;
            this.elemStyle[_filterStyle] = 'none';
            this.elemStyle.zIndex = 'auto';
            this.hasPeeked = false;
        }

        function setTo(distance){
            EKTweener.killTweensOf(this.tearParams);
            this.tearParams.distance = distance;
            this._setRender();
        }

        function easeTo(distance, duration){
            if(this.tearParams.distance === 0) this.tearParams.distance = 0.1;
            EKTweener.to(this.tearParams, duration, {distance: distance, ease: 'easeInOutSine'});
            this._setRender();
        }

        function updateSize() {
            var itemWidth = this.$elem.width();
            var itemHeight = this.$elem.height();
            var params = this.tearParams;
            var seg = Math.ceil((params.isVertical ? itemHeight: itemWidth) / this.shaderPadding / 2) * 2 + 2;
            if(params.isVertical) {
                this.tear.updateHeader({segX: 6, segY: seg});
            } else {
                this.tear.updateHeader({segX: seg, segY: 6});
            }
            params.width = itemWidth;
            params.height = itemHeight;
            params.margin = (seg * this.shaderPadding - itemHeight) / 2;
        }

        function render(){
            var params = this.tearParams;
            this.elemStyle[_filterStyle] = this.tear.getStyle();
            if(params.distance === 0) {
                if(this.hasPeeked) this.onUnPeekCallback();
                this.resetShader();
            }
        }

/**
 * STATIC FUNCTIONS
 */

        function _onItemMove(e){
            var isScrollV = inputController.isScrollV;
            var i = _isDownItems.length;
            var params, target, delta, isVertical, isUsingFront;
            while(i--) {
                target = _isDownItems[i];
                isVertical = target.tearParams.isVertical;
                if(isVertical == isScrollV){
                    params = target.tearParams;
                    delta = isVertical ? e.deltaY : e.deltaX;
                    if(isUsingFront = target.isUsingFront) delta *= -1;
                    params.distance += delta;
                    if(!target.hasPeeked && params.distance > 0) {
                        target.onPeekCallback();
                        target.hasPeeked = true;
                    }
                    if(params.distance < 0) params.distance = 0;
                    target._setRender();
                }
            }
        }

        function _onItemUp(e){
            if(sectionController.isAnimating()) return;
            var i = _isDownItems.length;
            var target;
            while(i--) {
                target = _isDownItems[i];
                if(target.tearParams.distance > 100) {
                    target.onOpenCallback();
                } else {
                    target.easeTo(0, .3);
                }
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

        return TearItem;

    }
);
