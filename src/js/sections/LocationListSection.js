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
        'hbs!templates/sections/locationList',
        'widgets/SimpleScrollPane',
        'inputController',
        'sectionController',
        'locationController',
        'widgets/FoldListItem',
        'helpers/colorHelper',
        'mout/function/bind',
        'mout/string/properCase',
        'stageReference',
        'helpers/tweenHelper'
    ], function(config, $, AbstractSection, template, SimpleScrollPane, inputController, sectionController, locationController, FoldListItem, colorHelper, bind, properCase, stageReference, tweenHelper){

        var undef;

        function LocationListSection(){
            _super.constructor.call(this, 'location-list', template);

            // map the location data to the section data for the template
            this.data.items = config.data.locations;
            this.init();
            this.urlPrefix = '';

            this._initVariables();
            this._initEvents();

            this.scrollPane.init();
        }

        var _super = AbstractSection.prototype;
        var _p = LocationListSection.prototype = new AbstractSection();
        _p.constructor = LocationListSection;

        var _transform3DStyle = config.transform3DStyle;

        var SHADER_PADDING = 40;
        var ITEM_HEIGHT = 80;
        var HEADER_HEIGHT = 55;

        function _initVariables(){
            var self = this;
            this.items = this.container.find('.location-list-item');

            this.moveContainers = this.container.find('.move-container');
            this.topContainer = this.moveContainers.filter('.top');
            this.bottomContainer = this.moveContainers.filter('.bottom');

            this.scrollPane = new SimpleScrollPane(
                this.container.find('.scroll-wrapper'),
                this.container.find('.scroll-move-container'),
                this.container.find('.indicator')
            );

            this.searchContainer = $('#location-search');
            this.searchForm = this.searchContainer.find('form');
            this.searchInput = this.searchContainer.find('.search');
            this.searchNum = this.searchContainer.find('.num');

            this.items.each(function(i){
                this.__id = $(this).data('id');
                this.foldListItem = new FoldListItem(this, bind(_onItemPeek, self, this), _onItemUnPeek, bind(_onItemOpen, self, this), SHADER_PADDING);
                inputController.add(this, 'click', bind(_onItemOpen, self, this));
            });

            // generate the color list
            var i, j, len, color;
            var colors = this.data.colors;
            for(i = 0, len = colors.length; i < len; i++) {
                colors[i].list = colorHelper.generateShadeList(colors[i].hue_from, colors[i].hue_to, 20, 40, 20, 40, 10);
            }
        }

        function _initEvents(){
            var self = this;
            inputController.add(this.container, 'down', bind(_onContainerDown, this));
            this.searchInput.on('keyup change', function(){
                self.appear(sectionController.currentNodes, false, true);
            });
            this.searchForm.submit(function(){
                self.searchInput.blur();
                return false;
            });
        }

        function _onContainerDown(e){
            if(e.target !== this.searchInput[0]) {
                this.searchInput.blur();
            }
        }

        function _onItemPeek(target){
            sectionController.appearTarget(this.urlPrefix + target.__id);
        }

        function _onItemUnPeek(){
            if(!sectionController.isAnimating() && FoldListItem.needRenderItems.length === 0) {
                sectionController.sections.overview.disappear();
            }
        }

        function _onItemOpen(target){
            sectionController.goTo(this.urlPrefix + target.__id);
        }

        function _getColorList(method, filter){
            var i, len;
            var colors = this.data.colors;
            var pattern = method + '/' + filter;
            for(i = 0, len = colors.length - 1; i < len; i++) {
                if(colors[i].id.indexOf(pattern) > -1) break;
            }
           return colors[i].list;
        }

        function _getItemsFromFilteredList(filteredList) {
            var dummyContainer = $('<div>');
            for(var i = 0, len = filteredList.length; i < len; i++) {
                dummyContainer.append(this.items[filteredList[i].index]);
            }
            return dummyContainer.find('> div');
        }

        function _onResize(e){
            this.scrollPane.onResize();
        }

        function appear(nodes, isFromShow, isOnSearchUpdate){
            this.container.show();
            this.items.hide();
            var searchText, filteredList, filteredItems;
            var colorList = this._getColorList(nodes[1], nodes[2]);
            var colorListLength = colorList.length;
            if(nodes[1] === 'search') {
                if(isOnSearchUpdate) {
                    searchText = locationController.slugifyText(this.searchInput.val());
                } else {
                    this.container.addClass('search');
                    searchText = locationController.slugifyText(nodes[2]);
                    this.searchInput.val(properCase(searchText.replace('-', ' ')));
                }
                filteredList = locationController.getBlurryMatched('keywords', searchText);
                this.urlPrefix = nodes[0] + '/search/' + (searchText.length > 0 ? searchText : '_') + '/';
                this.searchNum.html(filteredList.length);
            } else {
                this.container.removeClass('search');
                this.urlPrefix = nodes.join('/')+'/';
                filteredList = locationController.getMatched(nodes[1], nodes[2]);
            }
            this.filteredItems = filteredItems = this._getItemsFromFilteredList(filteredList);
            filteredItems.each(function(i){
                this.style.backgroundColor = colorList[i%colorListLength];
                this.style.top = (i * ITEM_HEIGHT) + 'px';
            });
            this.topContainer.after(filteredItems);
            filteredItems.show();
            this.scrollPane.moveContainerStyle.height = (filteredItems.length * ITEM_HEIGHT) + 'px';
            this.scrollPane.onResize();
            if(!isFromShow && !isOnSearchUpdate) {
                this.scrollPane.moveToPos(0,1);
            }
        }

        function _addToMoveContainers(index){
            var self = this;
            var items = this.items;
            var fromId =  Math.floor(- this.scrollPane._pos / ITEM_HEIGHT);
            var toId = fromId + Math.ceil((stageReference.stageHeight - HEADER_HEIGHT) / ITEM_HEIGHT) + 1;
            this.filteredItems.each(function(i){
                this.style.display = i < fromId || i > toId ? 'none' : 'block';
                if(i < index) {
                    // add to the top container;
                    self.topContainer.append(this);
                } else if(i > index) {
                    // add to the bottom container;
                    self.bottomContainer.append(this);
                    this.style.top = ((i- index -1) * ITEM_HEIGHT) + 'px';
                }
            });
           this.bottomContainer[0].style.top = ((index + 1) * ITEM_HEIGHT) + 'px';
        }

        function _removeFromMoveContainers(index){
            this.items.detach();
            this.filteredItems.each(function(i){
                this.style.top = (i * ITEM_HEIGHT) + 'px';
            }).show();
            this.topContainer.after(this.items);
        }

        function show(currentNodes, previousSection, previousNodes){
            var self = this;
            this.appear.apply(this, [currentNodes, true]);
            stageReference.onResize.add(_onResize, this);
            this._onResize();
            if(previousNodes.length < 3 || previousSection == this) {
                this.searchContainer[0].style[_transform3DStyle] = 'translateZ(0)';
                self._setShown();
            } else {
                var foundTarget;
                var locationId = previousNodes[3];
                var foundId = this.filteredItems.length;
                while(foundId--) if($(foundTarget = this.filteredItems[foundId]).data('id') === locationId) break;
                var moveDistance = stageReference.stageHeight;
                this._addToMoveContainers(foundId);
                foundTarget.foldListItem.updateSize();
                foundTarget.foldListItem.setTo(-1.2, 1);
                setTimeout(function(){
                    foundTarget.foldListItem.easeTo(0, 1, .5);
                }, 500);

                this.topContainer[0].style[_transform3DStyle] = this.searchContainer[0].style[_transform3DStyle] = 'translate3d(0,' + (- moveDistance) +  'px,0)';
                this.bottomContainer[0].style[_transform3DStyle] = 'translate3d(0,' + moveDistance +  'px,0)';

                tweenHelper.addDom(this.searchContainer[0], {y: - moveDistance}).to({y: 0}, 500).easing( tweenHelper.Easing.Sinusoidal.Out).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.topContainer[0], {y: - moveDistance}).to({y: 0}, 500).easing( tweenHelper.Easing.Sinusoidal.Out).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.bottomContainer[0], {y: moveDistance}).to({y: 0}, 500).easing( tweenHelper.Easing.Sinusoidal.Out).onUpdate(tweenHelper.translateXY3DCallback).start();

                setTimeout(function(){
                    self._removeFromMoveContainers();
                    self._setShown();
                }, 1000);
            }
        }

        function hide(currentSection, currentNodes){
            var self = this;
            stageReference.onResize.remove(_onResize, this);
            if(currentNodes.length < 3 || currentSection == this) {
                self._setHidden();
            } else {
                var foundTarget;
                var locationId = currentNodes[3];
                var foundId = this.filteredItems.length;
                while(foundId--) if($(foundTarget = this.filteredItems[foundId]).data('id') === locationId) break;
                var moveDistance = stageReference.stageHeight;
                this._addToMoveContainers(foundId);
                foundTarget.foldListItem.updateSize();
                foundTarget.foldListItem.easeTo(-1.2, 1, .5);

                this.topContainer[0].style[_transform3DStyle] = this.bottomContainer[0].style[_transform3DStyle] = this.searchContainer[0].style[_transform3DStyle] = 'translate3d(0,0,0)';

                tweenHelper.addDom(this.searchContainer[0], {y: 0}).delay(500).to({y: - moveDistance}, 500).easing( tweenHelper.Easing.Sinusoidal.In).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.topContainer[0], {y: 0}).delay(500).to({y: - moveDistance}, 500).easing( tweenHelper.Easing.Sinusoidal.In).onUpdate(tweenHelper.translateXY3DCallback).start();
                tweenHelper.addDom(this.bottomContainer[0], {y: 0}).delay(500).to({y: moveDistance}, 500).easing( tweenHelper.Easing.Sinusoidal.In).onUpdate(tweenHelper.translateXY3DCallback).start();

                setTimeout(function(){
                    self.container.hide();
                    self._removeFromMoveContainers();
                    self.items.each(function(i){
                        this.foldListItem.resetShader();
                    });
                    self._setHidden();
                }, 1000);
            }
        }

        function getNodeName(nodeId){
            var location = locationController.locations[nodeId];
            if(location) {
                return location.name;
            } else {
                var searchText = locationController.slugifyText(nodeId);
                return searchText.length > 0 ? 'Search: ' + properCase(searchText) : 'All';
            }
        }


        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;

        _p._getColorList = _getColorList;
        _p._getItemsFromFilteredList = _getItemsFromFilteredList;
        _p._onResize = _onResize;
        _p.appear = appear;
        _p._addToMoveContainers = _addToMoveContainers;
        _p._removeFromMoveContainers = _removeFromMoveContainers;
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;

        return LocationListSection;
    }
)
