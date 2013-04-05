define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/mood',
        'inputController',
        'sectionController',
        'locationController',
        'widgets/FoldListItem',
        'mout/function/bind',
        'stageReference'
    ], function(config, $, AbstractSection, template, inputController, sectionController, locationController, FoldListItem, bind, stageReference){

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
                    this.foldListItem = new FoldListItem(this, _onItemPeek, _onItemOpen, SHADER_PADDING);
                    $(this).find('.num').html(locationController.getMatched('mood', $(this).data('id')).length);
                });
            }
        }

        function _initEvents(){

        }

        function _onItemPeek(){
            console.log('peek')
            sectionController.appearTarget(this.$elem.data('link'));
        }

        function _onItemOpen(){
            console.log('open')
            sectionController.goTo(this.$elem.data('link'));
        }

        function show(currentNodes, previousSection, previousNodes){
            var self = this;
            this.container.show();
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
                        var foundTarget = this;
                        foundTarget.foldListItem.setTo(-stageReference.stageWidth * 1.2, .5);
                        setTimeout(function(){
                            foundTarget.foldListItem.easeTo(0, .5, .5);
                        }, 300);
                    } else {
                        EKTweener.to(this, .5, {transform3d: 'translate3d(0,0,0)', ease: 'easeOutSine'});
                    }
                });
                setTimeout(function(){
                    self._setShown();
                }, 800);
            }
        }

        function hide(currentSection, currentNodes){
            var self = this;
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
                        this.foldListItem.easeTo(-stageReference.stageWidth * 1.2, .5, .5);
                    } else {
                        EKTweener.to(this, .5, {delay: .3, transform3d: 'translate3d(0,' + (i > foundId ? moveDistance : - moveDistance) + 'px,0)', ease: 'easeInSine'});
                    }
                });
                setTimeout(function(){
                    self.items.each(function(i){
                        this.foldListItem.resetShader();
                    });
                    self._setHidden();
                }, 800);
            }
        }

        function getNodeName(nodeId){
            return this.nodeNames[nodeId];
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;

        return MoodSection;
    }
)
