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
        'stageReference'
    ], function(config, $, AbstractSection, template, SimpleScrollPane, inputController, sectionController, locationController, bind, stageReference){

        var undef;

        function LocationListSection(){
            _super.constructor.call(this, 'location-list', template);

            // map the location data to the section data for the template
            this.data.items = config.data.locations;
            this.init();
            
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
            stageReference.onResize.add(_onResize, this);
            inputController.add(this.items, 'click', bind(_onItemClick, this));
        }

        function _onItemClick(e){
            sectionController.goTo(e.currentTarget.__url);
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

        function _getItemsByData(key, value) {
            var filteredItems = $();
            this.items.each(function(){
                if($(this).data(key) === value) {
                    filteredItems = filteredItems.add(this);
                }
            });
            return filteredItems;
        }

        function _onResize(e){
            this.scrollPane.onResize();
        }

        function appear(nodes, opts){
            this.container.show();
            this.items.removeClass('show');
            var filteredItems;
            var colorList = this._getColorList(nodes[1], nodes[2]);
            var colorListLength = colorList.length;
            if(nodes[1] === 'search') {
                this.container.addClass('search');
                filteredItems = this.items;
            } else {
                this.container.removeClass('search');
                filteredItems = this._getItemsByData(nodes[1], nodes[2]);
            }
            var urlPrefix = sectionController.currentNodes.join('/')+'/';
            filteredItems.each(function(i){
                this.style.backgroundColor = colorList[i%colorListLength];
                this.__url = urlPrefix + this.__id;
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
            return locationController.locations[nodeId].name;
        }


        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;

        _p._getColorList = _getColorList;
        _p._getItemsByData = _getItemsByData;
        _p._onResize = _onResize;
        _p.appear = appear;
        _p.show = show;
        _p.hide = hide;
        _p.getNodeName = getNodeName;

        return LocationListSection;
    }
)