define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/mood',
        'inputController',
        'sectionController',
        'locationController',
        'effects/Fold',
        'mout/function/bind',
        'stageReference'
    ], function(config, $, AbstractSection, template, inputController, sectionController, locationController, Fold, bind, stageReference){

        function MoodSection(){
            _super.constructor.call(this, 'mood', template);

            this.init();
            this._initVariables();
            this._initEvents();

        }

        var _super = AbstractSection.prototype;
        var _p = MoodSection.prototype = new AbstractSection();
        _p.constructor = MoodSection;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;

        var SHADER_PADDING = 40;

        function _initVariables(){
            var self = this;
            var i, len;

            // create a map table for nodeId = nodeName
            var itemData = this.data.items;
            var nodeNames = this.nodeNames = {};
            for(i = 0, len = itemData.length; i < len; i++) {
                nodeNames[itemData[i].id] = itemData[i].name;
            }

            this.items = this.container.find('.mood-item');
            if(_filterStyle) {
                this.items.each(function(){
                    var target = this;
                    this.fold = new Fold({padding_height : SHADER_PADDING});
                    this.shaderShadowStyle = $(this).find('.shader-shadow')[0].style;
                    this.renderToggle = 0;
                    
                    $(this).find('.num').html(locationController.getMatched('mood', $(this).data('id')).length);
                });
            }
        }

        function _initEvents(){
            inputController.add(this.items, 'down', bind(_onItemDown, this));
            inputController.add(this.items, 'move', bind(_onItemMove, this));
            inputController.add(this.items, 'up', bind(_onItemUp, this));
        }

        function _onItemDown(e){
            target = e.currentTarget;
            target.isDown = true;
            var itemWidth = $(target).width();
            var itemHeight = $(target).height();
            var segY = Math.ceil(itemHeight / SHADER_PADDING) + 2;
            var params = target.fold.params;
            target.fold.updateHeader({segY: segY});
            params.width = itemWidth;
            params.height = itemHeight;
            params.padding_height = SHADER_PADDING;
            params.margin_height = (segY * SHADER_PADDING - itemHeight) / 2;
            params.down_x = e.x - params.distance;
            sectionController.appearTarget($(target).data('link'));
        }

        function _setRender(item){
            var params = item.fold.params;
            var shaderStyle = item.shaderShadowStyle;
            item.needRender = true;
            shaderStyle.display = 'block';
            shaderStyle.top = shaderStyle.bottom =  '-' + params.margin_height + 'px';
            item.style.zIndex = 100;
            item.style[_filterStyle] = item.fold.getStyle();
        }

        function _resetRender(item){
            item.needRender = false;
            item.shaderShadowStyle.display = 'none';
            item.fold.params.distance = 0;
            item.style[_filterStyle] = 'none';
            item.style.zIndex = 'auto';
        }

        function _onItemMove(e){
            target = e.currentTarget;
            if(!target.isDown || !inputController.isScrollH) return;
            if(_filterStyle) {
                var params = target.fold.params;
                params.distance += e.deltaX;
                if(params.distance > 0) params.distance = 0;
                if(!target.needRender) {
                    _setRender(target);
                }
            }
        }

        function _onItemUp(e){
            target = e.currentTarget;
            target.isDown = false;
            if(e.distanceX < -200) {
                sectionController.goTo($(target).data('link'));
            } else {
                EKTweener.to(target.fold.params, .3, {distance: 0});
            }
        }

        function _render(target){
            var self = this;
            this.items.each(function(){
                if(this.needRender) {
                    var params = this.fold.params;
                    if(this.renderToggle ^= 1) {
                        this.style[_filterStyle] = this.fold.getStyle();
                    } else {
                        this.style[_transform3DStyle] = 'translate3d(' + (params.distance / 2).toFixed(6) + 'px, 0, 0)';
                    }
                    if(params.distance == 0) _resetRender(this);
                }
            });
        }



        function show(currentNodes, previousSection, previousNodes){
            var self = this;
            this.container.show();
            stageReference.onRender.add(_render, this);
            if(previousNodes.length < 2) {
                self._setShown();
                this.items.each(function(i){
                    this.style[_transform3DStyle] = 'translateZ(0)';
                });
            } else {
                var targetItem;
                var nextNode = previousNodes[2];
                var foundId = this.items.length;
                while(foundId--) if($(this.items[foundId]).data('link').split('/')[2] === nextNode) break;
                var moveDistance = (this.items.length / 2 + Math.abs(this.items.length / 2 - (foundId+ 1))) * this.items.height();
                this.items.each(function(i){
                    if(i == foundId) {
                        EKTweener.to(this, .8, {delay: .3, transform3d: 'translate3d(0,0,0)'});
                    } else {
                        EKTweener.to(this, .5, {transform3d: 'translate3d(0,0,0)', ease: 'easeOutSine'});
                    }
                });
                setTimeout(function(){
                    self._setShown();
                }, 1100);
            }
        }

        function hide(currentSection, currentNodes){
            var self = this;
            stageReference.onRender.remove(_render, this);
            if(currentNodes.length < 2) {
                self._setHidden();
            } else {
                var targetItem;
                var nextNode = currentNodes[2];
                var foundId = this.items.length;
                while(foundId--) if($(this.items[foundId]).data('link').split('/')[2] === nextNode) break;
                var moveDistance = (this.items.length / 2 + Math.abs(this.items.length / 2 - (foundId+ 1))) * this.items.height();
                this.items.each(function(i){
                    if(i == foundId) {
                        EKTweener.to(this, .8, {transform3d: 'translate3d(' + (- stageReference.stageWidth) + 'px,0,0)'});
                    } else {
                        EKTweener.to(this, .5, {delay: .3, transform3d: 'translate3d(0,' + (i > foundId ? moveDistance : - moveDistance) + 'px,0)', ease: 'easeInSine'});
                    }
                });
                setTimeout(function(){
                    self.items.each(function(){
                        _resetRender(this);
                    });
                    self._setHidden();
                }, 1100);
            }
        }

        function getNodeName(nodeId){
            return this.nodeNames[nodeId];
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._render = _render;
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;

        return MoodSection;
    }
)
