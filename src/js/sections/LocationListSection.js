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
        'EKTweener'
    ], function(config, $, AbstractSection, template, SimpleScrollPane, inputController, sectionController, locationController, FoldListItem, colorHelper, bind, properCase, stageReference, EKTweener){

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

        var NUM_OF_SHADES = 10;
        var SHADER_PADDING = 40;

        function _initVariables(){
            var self = this;
            this.scrollPane = this.container.find('.scroll-pane');
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
            this.searchInput.on('keyup change', function(){
                self.appear(sectionController.currentNodes, false, true);
            });
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
            var filteredItems = $();
            for(var i = 0, len = filteredList.length; i < len; i++) {
                filteredItems = filteredItems.add(this.items[filteredList[i].index]);
            }
            return filteredItems;
        }

        function _onResize(e){
            this.scrollPane.onResize();
        }

        function appear(nodes, isFromShow, isOnSearchUpdate){
            this.container.show();
            this.items.removeClass('show');
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
            filteredItems = this._getItemsFromFilteredList(filteredList);
            filteredItems.each(function(i){
                this.style.backgroundColor = colorList[i%colorListLength];
            });
            filteredItems.addClass('show');
            this.scrollPane.onResize();
            if(!isFromShow && !isOnSearchUpdate) {
                this.scrollPane.moveToPos(0,1);
            }
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

        function show(currentNodes, previousSection, previousNodes){
            var self = this;
            this.appear.apply(this, [currentNodes, true]);
            stageReference.onResize.add(_onResize, this);
            this._onResize();
            if(previousNodes.length < 3 || previousSection == this) {
                self._setShown();
            } else {
                var foundTarget;
                var locationId = previousNodes[3];
                var foundId = this.items.length;
                while(foundId--) if($(foundTarget = this.items[foundId]).data('id') === locationId) break;
                var moveDistance = stageReference.stageHeight;
                this._addToMoveContainers(foundId);
                foundTarget.foldListItem.updateSize();
                foundTarget.foldListItem.setTo(-1.2, 1);
                setTimeout(function(){
                    foundTarget.foldListItem.easeTo(0, 1, .5);
                }, 300);
                this.topContainer[0].style[_transform3DStyle] = 'translate3d(0,' + (- moveDistance) +  'px,0)';
                this.bottomContainer[0].style[_transform3DStyle] = 'translate3d(0,' + moveDistance +  'px,0)';
                EKTweener.to(this.moveContainers, .5, {transform3d: 'translate3d(0,0,0)', ease: 'easeOutSine'});
                setTimeout(function(){
                    self._removeFromMoveContainers();
                    self._setShown();
                }, 800);
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
                var foundId = this.items.length;
                while(foundId--) if($(foundTarget = this.items[foundId]).data('id') === locationId) break;
                var moveDistance = stageReference.stageHeight;
                this._addToMoveContainers(foundId);
                foundTarget.foldListItem.updateSize();
                foundTarget.foldListItem.easeTo(-1.2, 1, .5);
                EKTweener.to(this.topContainer, .5, {delay: .3, transform3d: 'translate3d(0,' + (- moveDistance) +  'px,0)', ease: 'easeInSine'});
                EKTweener.to(this.bottomContainer, .5, {delay: .3, transform3d: 'translate3d(0,' + moveDistance +  'px,0)', ease: 'easeInSine'});
                setTimeout(function(){
                    self._removeFromMoveContainers();
                    self.items.each(function(i){
                        this.foldListItem.resetShader();
                    });
                    self._setHidden();
                }, 800);
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
