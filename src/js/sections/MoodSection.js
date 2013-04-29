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
        'hbs!templates/sections/mood',
        'inputController',
        'sectionController',
        'locationController',
        'widgets/FoldListItem',
        'mout/function/bind',
        'stageReference',
        'helpers/tweenHelper'
    ], function(config, $, AbstractSection, template, inputController, sectionController, locationController, FoldListItem, bind, stageReference, tweenHelper){

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

            this.moveContainers = this.container.find('.move-container');
            this.topContainer = this.moveContainers.filter('.top');
            this.bottomContainer = this.moveContainers.filter('.bottom');

            this.items = this.container.find('.mood-item');
            this.items.each(function(){
                this.foldListItem = new FoldListItem(this, _onItemPeek, _onItemUnPeek, _onItemOpen, SHADER_PADDING);
                inputController.add(this, 'click', bind(_onItemOpen, this.foldListItem));
                $(this).find('.num').html(locationController.getMatched('mood', $(this).data('id')).length);
            });
        }

        function _initEvents(){
        }

        function _onItemPeek(){
            sectionController.appearTarget(this.$elem.data('link'));
        }

        function _onItemUnPeek(){
            if(!sectionController.isAnimating() && FoldListItem.needRenderItems.length === 0) {
                sectionController.sections['location-list'].disappear();
            }
        }

        function _onItemOpen(){
            sectionController.goTo(this.$elem.data('link'));
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
            this.items.detach();
            this.topContainer.after(this.items);
        }

        function appear(){
            this.container.show();
            this.items.each(function(i){
                this.foldListItem.resetShader();
            });
            this._onResize();
        }

        function show(currentNodes, previousSection, previousNodes){
            var self = this;
            this.container.show();
            stageReference.onResize.add(_onResize, this);
            if(previousNodes.length < 2) {
                this.appear();
                self._setShown();
            } else {
                this._onResize();
                var foundTarget;
                var nextNode = previousNodes[2];
                var foundId = this.items.length;
                while(foundId--) if($(foundTarget = this.items[foundId]).data('link').split('/')[2] === nextNode) break;
                var moveDistance = (this.items.length / 2 + Math.abs(this.items.length / 2 - (foundId+ 1))) * this.items.height();
                this._addToMoveContainers(foundId);
                foundTarget.foldListItem.updateSize();
                foundTarget.foldListItem.setTo(-1.2, 1);
                setTimeout(function(){
                    foundTarget.foldListItem.easeTo(0, 1, .5);
                }, 300);
                this.topContainer[0].style[_transform3DStyle] = 'translate3d(0,' + (- moveDistance) +  'px,0)';
                this.bottomContainer[0].style[_transform3DStyle] = 'translate3d(0,' + moveDistance +  'px,0)';
                tweenHelper.addDom(this.topContainer[0], {y: - moveDistance}).to({y: 0}, 500).easing( tweenHelper.Easing.Sinusoidal.Out).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.bottomContainer[0], {y: moveDistance}).to({y: 0}, 500).easing( tweenHelper.Easing.Sinusoidal.Out).onUpdate(tweenHelper.translateXY3DCallback).start();

                setTimeout(function(){
                    self._removeFromMoveContainers();
                    self._setShown();
                }, 800);
            }
        }

        function hide(currentSection, currentNodes){
            var self = this;
            stageReference.onResize.remove(_onResize, this);
            if(currentNodes.length < 2) {
                self._setHidden();
            } else {
                var foundTarget;
                var nextNode = currentNodes[2];
                var foundId = this.items.length;
                while(foundId--) if($(foundTarget = this.items[foundId]).data('link').split('/')[2] === nextNode) break;
                var moveDistance = (this.items.length / 2 + Math.abs(this.items.length / 2 - (foundId+ 1))) * this.items.height();
                this._addToMoveContainers(foundId);
                foundTarget.foldListItem.updateSize();
                foundTarget.foldListItem.easeTo(- 1.2, 1, .5);

                this.topContainer[0].style[_transform3DStyle] = this.bottomContainer[0].style[_transform3DStyle] = 'translate3d(0,0,0)';
                tweenHelper.addDom(this.topContainer[0], {y: 0}).delay(300).to({y: - moveDistance}, 500).easing( tweenHelper.Easing.Sinusoidal.In).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.bottomContainer[0], {y: 0}).delay(300).to({y: moveDistance}, 500).easing( tweenHelper.Easing.Sinusoidal.In).onUpdate(tweenHelper.translateXY3DCallback).start();

                setTimeout(function(){
                    self.container.hide();
                    self._removeFromMoveContainers();
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

        function _onResize(){
            this.items.height(Math.ceil(this.container.height()/ this.items.length));
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p.appear = appear;
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;
        _p._onResize = _onResize;

        _p._addToMoveContainers = _addToMoveContainers;
        _p._removeFromMoveContainers = _removeFromMoveContainers;



        return MoodSection;
    }
)
