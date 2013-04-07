define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/locationList',
        'widgets/SimpleScrollPane',
        'inputController',
        'sectionController',
        'locationController',
        'mout/function/bind',
        'mout/string/properCase',
        'stageReference'
    ], function(config, $, AbstractSection, template, SimpleScrollPane, inputController, sectionController, locationController, bind, properCase, stageReference){

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

        var NUM_OF_SHADES = 10;

        function _initVariables(){
            this.scrollPane = this.container.find('.scroll-pane');
            this.items = this.container.find('.location-list-item');
            this.searchContainer = $('#location-search');
            this.searchInput = this.searchContainer.find('.search');
            this.searchNum = this.searchContainer.find('.num');
            this.scrollPane = new SimpleScrollPane(
                this.container.find('.scroll-wrapper'),
                this.container.find('.move-container'),
                this.container.find('.indicator')
            );

            this.items.each(function(i){
                this.__id = $(this).data('id');
            });

            // generate the color list
            var i, j, len, color, list;
            var colors = this.data.colors;
            for(i = 0, len = colors.length; i < len; i++) {
                color = colors[i];
                list = color.list = [];
                for(j = 0; j < NUM_OF_SHADES * 2; j++) {
                    list[j] = 'hsl(' + color.hue + ',20%,' + (20 + (j > NUM_OF_SHADES ? 2 * NUM_OF_SHADES - j : j) * 2) + '%)';
                }
            }
        }

        function _initEvents(){
            var self = this;
            stageReference.onResize.add(_onResize, this);
            inputController.add(this.items, 'click', bind(_onItemClick, this));
            this.searchInput.on('keyup change', function(){
                self.appear(sectionController.currentNodes, true);
            });
        }

        function _onItemClick(e){
            sectionController.goTo(this.urlPrefix + e.currentTarget.__id);
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

        function appear(nodes, isOnSearchUpdate){
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
            this.scrollPane.moveToPos(0,1);
        }

        function show(currentNodes, previousSection, previousNodes){
            this.appear.apply(this, [currentNodes]);
            this._setShown();
        }

        function hide(currentSection, currentNodes){
            this._setHidden();
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
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;

        return LocationListSection;
    }
)
