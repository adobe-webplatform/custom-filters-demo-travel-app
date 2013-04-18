define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/home',
        'inputController',
        'sectionController',
        'widgets/TearItem',
        'mout/function/bind',
        'stageReference'
    ], function(config, $, AbstractSection, template, inputController, sectionController, TearItem, bind, stageReference){

        function HomeSection(){
            _super.constructor.call(this, 'home', template);

            this.isDown = false;
            this.draggedTarget = null;

            this.init();
            this._initVariables();
            this._initEvents();

        }

        var _super = AbstractSection.prototype;
        var _p = HomeSection.prototype = new AbstractSection();
        _p.constructor = HomeSection;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;

        var WIDE_THRESHOLD = 900;
        var SHADER_PADDING = 100;

        function _initVariables(){
            var self = this;

            this.moveContainers = this.container.find('.move-container');
            this.topContainer = this.moveContainers.filter('.top');
            this.bottomContainer = this.moveContainers.filter('.bottom');

            this.items = this.container.find('.home-item');

            this.items.each(function(){
                this.tearItem = new TearItem(this, _onItemPeek, _onItemUnPeek, _onItemOpen, SHADER_PADDING);
                //inputController.add(this, 'click', bind();
            });

            // create a map table for nodeId = nodeName
            var itemData = this.data.items;
            var nodeNames = this.nodeNames = {};
            for(i = 0, len = itemData.length; i < len; i++) {
                nodeNames[itemData[i].id] = itemData[i].name;
            }
        }

        function _initEvents(){
            this.items.each(function(){
                inputController.add(this, 'click', bind(_onItemOpen, this.tearItem));
            });

        }

        function _onItemPeek(){
            sectionController.appearTarget(this.$elem.data('link'));
        }

        function _onItemUnPeek(){
            sectionController.disappearTarget(this.$elem.data('link'));
        }

        function _onItemOpen(){
            sectionController.goTo(this.$elem.data('link'));
        }

        function _onResize(){
            var isWide = this.isWide = this.container.width() > WIDE_THRESHOLD;
            this.items.each(function(){
                this.tearItem.updateSize(isWide ? 1 : 0);
            }).css({
                width: (isWide ? .333 : 1) * stageReference.stageWidth,
                height: (isWide ? 1 : .333) * stageReference.stageHeight
            });
        }

        function appear(nodes){
            this.container.show();
            this.items.each(function(){
                this.tearItem.resetShader();
                this.style[_transform3DStyle] = 'translateZ(0)';
            });
        }

        function _addToMoveContainers(index){
            var items = this.items;
            for(var i = 0, len = items.length; i < len; i++) {
                if(i < index) {
                    // add to the top container;
                    this.topContainer.append(items[i]);
                } else if(i > index) {
                    // add to the bottom container;
                    this.bottomContainer.append(items[i]);
                }
            }
        }

        function _removeFromMoveContainers(index){
            var items = this.items;
            items.detach();
            this.topContainer.after(items);
        }


        function show(currentNodes, previousSection, previousNodes){
            this.container.show();
            stageReference.onResize.add(_onResize, this);
            this._onResize();
            if(previousNodes.length < 1 || sectionController.isFirstRoute) {
                this.appear();
                this._setShown();
            } else {
                var self = this;
                var foundTarget;
                var previousNode = previousNodes[1];
                var foundId = this.items.length;
                var direction;
                while(foundId--) if($(foundTarget = this.items[foundId]).data('link').split('/')[1] === previousNode) break;
                var moveDistance = (this.isWide ? stageReference.stageWidth : stageReference.stageHeight) * 2 / 3;
                this._addToMoveContainers(foundId);
                foundTarget.tearItem.updateSize();
                foundTarget.tearItem.setTo(1);
                setTimeout(function(){
                    foundTarget.tearItem.easeTo(0, .5);
                }, 300);
                this.topContainer[0].style[_transform3DStyle] = 'translate3d(' + (self.isWide ? (- moveDistance) + 'px,0' : '0,' + (- moveDistance) + 'px') + ',0)';
                this.bottomContainer[0].style[_transform3DStyle] = 'translate3d(' + (self.isWide ? moveDistance + 'px,0' : '0,' + moveDistance + 'px') + ',0)';
                EKTweener.to(this.moveContainers, .5, {transform3d: 'translate3d(0,0,0)', ease: 'easeOutSine'});
                setTimeout(function(){
                    self._removeFromMoveContainers();
                    self._setShown();
                }, 800);
            }
        }

        function hide(currentSection, currentNodes){
            var self = this;
            if(currentNodes.length < 1) {
                self._setHidden();
            } else {
                var foundTarget;
                var nextNode = currentNodes[1];
                var foundId = this.items.length;
                var direction;
                while(foundId--) if($(foundTarget = this.items[foundId]).data('link').split('/')[1] === nextNode) break;
                var moveDistance = (this.isWide ? stageReference.stageWidth : stageReference.stageHeight) * 2 / 3;
                this._addToMoveContainers(foundId);
                foundTarget.tearItem.updateSize();
                foundTarget.tearItem.easeTo(1, .8);
                EKTweener.to(this.topContainer, .5, {delay: .3, transform3d: 'translate3d(' + (self.isWide ? (- moveDistance) + 'px,0' : '0,' + (- moveDistance) + 'px') + ',0)', ease: 'easeInSine'});
                EKTweener.to(this.bottomContainer, .5, {delay: .3, transform3d: 'translate3d(' + (self.isWide ? moveDistance + 'px,0' : '0,' + moveDistance + 'px') + ',0)', ease: 'easeInSine'});
                setTimeout(function(){
                    self._removeFromMoveContainers();
                    stageReference.onResize.remove(_onResize, self);
                    self._setHidden();
                }, 800);
            }
        }

        function getNodeName(nodeId){
            return this.nodeNames[nodeId];
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._onResize = _onResize;
        _p.appear = appear;
        _p._addToMoveContainers = _addToMoveContainers;
        _p._removeFromMoveContainers = _removeFromMoveContainers;
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;


        return HomeSection;
    }
)
