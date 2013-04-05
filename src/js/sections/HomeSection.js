define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/home',
        'inputController',
        'sectionController',
        'mout/function/bind',
        'stageReference'
    ], function(config, $, AbstractSection, template, inputController, sectionController, bind, stageReference){

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

        function _initVariables(){
            this.items = this.container.find('.home-item');

            // create a map table for nodeId = nodeName
            var itemData = this.data.items;
            var nodeNames = this.nodeNames = {};
            for(i = 0, len = itemData.length; i < len; i++) {
                nodeNames[itemData[i].id] = itemData[i].name;
            }
        }

        function _initEvents(){
            inputController.add(this.items, 'down', bind(_onItemDown, this));
            inputController.add(this.items, 'move', bind(_onItemMove, this));
            inputController.add(this.items, 'up', bind(_onItemUp, this));

            stageReference.onResize.add(_onResize, this);
            this._onResize();
        }

        function _onItemDown(e){
            this.isDown = true;
        }

        function _onItemMove(e){
            if(!this.isDown) return;
            if(!this.isWide && !inputController.isScrollH) return;
            if(this.isWide && !inputController.isScrollV) return;
            this.draggedTarget = e.currentTarget;

            // for temporary
            sectionController.goTo($(this.draggedTarget).data('link'));
            this.draggedTarget = null;
            this.isDown = false;
        }

        function _onItemUp(e){
            target = e.currentTarget;
            this.isDown = false;
        }

        function _onResize(e){
            this.isWide = this.container.width() > 1050;
        }

        function show(currentNodes, previousSection, previousNodes){
            this.container.show();
            var transformTo = 'translate3d(0,0,0)';
            if(previousNodes.length < 0 || sectionController.isFirstRoute) {
                this.items.each(function(){
                    EKTweener.to(this, 0, {transform3d: transformTo});
                });
                this._setShown();
            } else {
                var self = this;
                var targetItem;
                var previousNode = previousNodes[1];
                var transformTo = 'translate3d(0,0,0)';
                this.items.each(function(){
                    if($(this).data('link').split('/')[1] === previousNode) {
                        EKTweener.to(this, .8, {delay: .3, transform3d: transformTo});
                    } else {
                        EKTweener.to(this, .8, {transform3d: transformTo});
                    }
                });
                setTimeout(function(){
                    self._setShown();
                }, 1100);
            }
        }

        function hide(currentSection, currentNodes){
            var self = this;
            if(currentNodes.length < 1) {
                self._setHidden();
            } else {
                var targetItem;
                var nextNode = currentNodes[1];
                var transformTo = this.isWide ? 'translate3d(0,-' + stageReference.stageHeight + 'px,0)' : 'translate3d(-' + stageReference.stageWidth + 'px,0,0)';
                this.items.each(function(){
                    if($(this).data('link').split('/')[1] === nextNode) {
                        EKTweener.to(this, .8, {transform3d: transformTo});
                    } else {
                        EKTweener.to(this, .8, {delay: .3, transform3d: transformTo});
                    }
                });
                setTimeout(function(){
                    self._setHidden();
                }, 1100);
            }
        }

        function getNodeName(nodeId){
            return this.nodeNames[nodeId];
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._onResize = _onResize;
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;


        return HomeSection;
    }
)
