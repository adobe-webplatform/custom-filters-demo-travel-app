define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/schedule',
        'hbs!templates/sections/scheduleItem',
        'widgets/SimpleScrollPane',
        'inputController',
        'sectionController',
        'scheduleController',
        'widgets/FoldListItem',
        'helpers/colorHelper',
        'helpers/handlebarsHelper',
        'mout/function/bind',
        'stageReference',
        'EKTweener'
    ], function(config, $, AbstractSection, sectionTemplate, itemTemplate, SimpleScrollPane, inputController, sectionController, scheduleController, FoldListItem, colorHelper, handlebarsHelper, bind, stageReference, EKTweener){

        function ScheduleSection(){
            _super.constructor.call(this, 'schedule', sectionTemplate);

            this.init();

            this.eventData = this.data.events;
            this.myPlanData = this.data.my_plans;

            handlebarsHelper.define('__schedule_view__', this.eventData.prompt_btn);
            handlebarsHelper.define('__schedule_edit__', this.myPlanData.prompt_btn);

            this._initVariables();
            this._initEvents();

        }

        var _super = AbstractSection.prototype;
        var _p = ScheduleSection.prototype = new AbstractSection();
        _p.constructor = ScheduleSection;

        var _transform3DStyle = config.transform3DStyle;

        var SHADER_PADDING = 40;

        function _initVariables(){
            var i, j, len, color, list, orderList;
            var self = this;
            this.items = $();
            this.eventItems = $();
            this.myPlanItems = $();

            this.moveContainers = this.container.find('.move-container');
            this.topContainer = this.moveContainers.filter('.top');
            this.bottomContainer = this.moveContainers.filter('.bottom');

            this.scrollPane = new SimpleScrollPane(
                this.container.find('.scroll-wrapper'),
                this.container.find('.scroll-move-container'),
                this.container.find('.indicator')
            );

            // generate the color list
            list = [this.data.events, this.data.my_plans];
            for(i = 0, len = list.length; i < len; i++) list[i].colors = colorHelper.generateShadeList(list[i].hue_from, list[i].hue_to, 33, 58, 50, 70, 10);

            this._initItemList('eventItems', scheduleController.events, this.data.events.colors);
            this._initItemList('myPlanItems', scheduleController.myPlans, this.data.my_plans.colors);

            this.eventItems.find('.edit').remove();
            this.myPlanItems.find('.view').remove();

            this.topContainer.after(this.items);
        }

        function _initEvents(){
            var self = this;
        }

        function _initItemList(listName, listData, colorList){
            listData.listName = listName;
            for(i = 0, len = listData.length; i < len; i++) this._createItem(listData[i]);
            this._sortItems(listData, colorList);
        }

        function _sortItems(listData, colorList){
            var i, len, list, orderList;
            var fakeContainer = $('<div>');
            var listName = listData.listName;
            this[listName].detach();
            orderList = listData.orderList;
            for(i = 0, len = orderList.length; i < len; i++) fakeContainer.append(listData[orderList[i].index].item);
            var items = this[listName] = fakeContainer.find('> *');
            this._updateItemsColor(items, colorList);
            this.topContainer.after(items);
        }

        function _updateItemsColor(items, colorList){
            var colorListLength = colorList.length;
            items.each(function(i){
                this.style.backgroundColor = colorList[i%colorListLength];
            });
        }

        function _createItem(itemData){
            var $item = $(itemTemplate(itemData));
            var item = $item[0];
            item.foldListItem = new FoldListItem(item, bind(_onItemPeek, this, item), _onItemUnPeek, bind(_onItemOpen, this, item), SHADER_PADDING);
            inputController.add(item, 'click', bind(_onItemClick, this, item));
            item.__data = itemData;
            itemData.item = item;
        }


        function _onItemPeek(target){
        }

        function _onItemUnPeek(){
        }

        function _onItemClick(item, e){
            if($(e.currentTarget).hasClass('prompt-btn')) {

            } else {
                _onItemOpen.call(this, item);
            }
        }

        function _onItemOpen(target){

        }


        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._initItemList = _initItemList;
        _p._createItem = _createItem;
        _p._updateItemsColor = _updateItemsColor;
        _p._sortItems = _sortItems;

        return ScheduleSection;
    }
)
