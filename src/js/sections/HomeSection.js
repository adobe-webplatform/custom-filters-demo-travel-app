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
        'hbs!templates/sections/home',
        'inputController',
        'sectionController',
        'widgets/TearItem',
        'mout/function/bind',
        'stageReference',
        'helpers/tweenHelper'
    ], function(config, $, AbstractSection, template, inputController, sectionController, TearItem, bind, stageReference, tweenHelper){

        function HomeSection(){
            _super.constructor.call(this, 'home', template);

            this.draggedTarget = null;

            this.init();
            this._initVariables();
            this._initEvents();

            this.isFirstTime = true;

        }

        var _super = AbstractSection.prototype;
        var _p = HomeSection.prototype = new AbstractSection();
        _p.constructor = HomeSection;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;

        var WIDE_THRESHOLD = 900;
        var SHADER_PADDING = 100;
        var HEADER_HEIGHT = 55;

        function _initVariables(){
            var self = this;

            this.moveContainers = this.container.find('.move-container');
            this.topContainer = this.moveContainers.filter('.top');
            this.bottomContainer = this.moveContainers.filter('.bottom');

            this.arrows = this.container.find('.arrow');

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
                height: (isWide ? 1 : .333) * (stageReference.stageHeight - HEADER_HEIGHT)
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
            var self = this;
            this.container.show();
            stageReference.onResize.add(_onResize, this);
            this._onResize();

            //arrow animation
            if(this.isFirstTime) {
                setTimeout(function(){
                    self.arrows.addClass('show animate');
                    setTimeout(function(){
                        self.arrows.removeClass('animate');
                        // in Chrome Canary v28, the custom filter won't work probably on the children with transform 3d.
                        self.arrows.css(_transform3DStyle, 'none');
                    }, 400);
                }, 800);
                this.isFirstTime = false;
            }

            if(previousNodes.length < 1 || sectionController.isFirstRoute) {
                this.appear();
                this._setShown();
            } else {
                var foundTarget;
                var previousNode = previousNodes[1];
                var foundId = this.items.length;
                var direction;
                this.items.each(function(){
                    this.tearItem.resetShader();
                    this.tearItem.resetDown();
                });
                while(foundId--) if($(foundTarget = this.items[foundId]).data('link').split('/')[1] === previousNode) break;
                var moveDistance = (this.isWide ? stageReference.stageWidth : stageReference.stageHeight - HEADER_HEIGHT) * 2 / 3;
                this._addToMoveContainers(foundId);
                foundTarget.tearItem.updateSize();
                foundTarget.tearItem.setTo(1);
                setTimeout(function(){
                    foundTarget.tearItem.easeTo(0, .5);
                }, 400);
                this.topContainer[0].style[_transform3DStyle] = 'translate3d(' + (self.isWide ? (- moveDistance) + 'px,0' : '0,' + (- moveDistance) + 'px') + ',0)';
                this.bottomContainer[0].style[_transform3DStyle] = 'translate3d(' + (self.isWide ? moveDistance + 'px,0' : '0,' + moveDistance + 'px') + ',0)';

                tweenHelper.addDom(this.topContainer[0], self.isWide ? {x: - moveDistance, y: 0} : {x: 0, y: - moveDistance}).to({x: 0, y: 0}, 500).easing( tweenHelper.Easing.Sinusoidal.Out).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.bottomContainer[0], self.isWide ? {x: moveDistance, y: 0} : {x: 0, y: moveDistance}).to({x: 0, y: 0}, 500).easing( tweenHelper.Easing.Sinusoidal.Out).onUpdate(tweenHelper.translateXY3DCallback).start();

                setTimeout(function(){
                    foundTarget.tearItem.resetShader();
                    self._removeFromMoveContainers();
                    self._setShown();
                }, 900);
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
                var moveDistance = (this.isWide ? stageReference.stageWidth : stageReference.stageHeight - HEADER_HEIGHT) * 2 / 3;
                this._addToMoveContainers(foundId);
                foundTarget.tearItem.updateSize();
                foundTarget.tearItem.easeTo(1, .5);

                this.topContainer[0].style[_transform3DStyle] = this.bottomContainer[0].style[_transform3DStyle] = 'translate3d(0,0,0)';
                tweenHelper.addDom(this.topContainer[0], {x: 0, y: 0}).delay(400).to(self.isWide ? {x: - moveDistance} : {y: - moveDistance}, 500).easing( tweenHelper.Easing.Sinusoidal.In).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.bottomContainer[0], {x: 0, y: 0}).delay(400).to(self.isWide ? {x: moveDistance} : {y: moveDistance}, 500).easing( tweenHelper.Easing.Sinusoidal.In).onUpdate(tweenHelper.translateXY3DCallback).start();

                setTimeout(function(){
                    self.container.hide();
                    self._removeFromMoveContainers();
                    stageReference.onResize.remove(_onResize, self);
                    self._setHidden();
                }, 900);
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
