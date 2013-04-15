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

            this.currentTabName = '';

            handlebarsHelper.define('__schedule_view__', this.eventData.prompt_btn);
            handlebarsHelper.define('__schedule_edit__', this.myPlanData.prompt_btn);

            this._initVariables();
            this._initEvents();

            scheduleController.onOrderChanged.add(_onMyPlansOrderChanged, this);

            this.scrollPane.init();
        }

        var _super = AbstractSection.prototype;
        var _p = ScheduleSection.prototype = new AbstractSection();
        _p.constructor = ScheduleSection;

        var _transform3DStyle = config.transform3DStyle;

        var SHADER_PADDING = 40;

        var DEFAULT_TAB_NAME = 'events';

        function _initVariables(){
            var i, j, len, color, tabData, listData, sectionData;
            var self = this;

            this.moveContainers = this.container.find('.move-container');
            this.topContainer = this.moveContainers.filter('.top');
            this.bottomContainer = this.moveContainers.filter('.bottom');

            this.scrollPane = new SimpleScrollPane(
                this.container.find('.scroll-wrapper'),
                this.container.find('.scroll-move-container'),
                this.container.find('.indicator')
            );

            this.items = $();
            this.events = scheduleController.events;
            this.myPlans = scheduleController.myPlans;

            this.events.sectionData = this.data.events;
            this.myPlans.sectionData = this.data.my_plans;

            this.events.tab = this.container.find('.tab.events');
            this.myPlans.tab = this.container.find('.tab.my-plans');


            tabData = this.tabData = { 'events': this.events, 'my-plans': this.myPlans };
            for(i in tabData) {
                tabListData = tabData[i];
                sectionData = tabListData.sectionData;
                tabListData.colors = colorHelper.generateShadeList(sectionData.hue_from, sectionData.hue_to, 33, 58, 50, 70, 10);
                this._initItemList(tabListData);
            }

            this.events.items.find('.edit').remove();
            this.myPlans.items.find('.view').remove();

            this.topContainer.after(this.items);
        }

        function _initEvents(){
            var self = this;
        }

        function _onMyPlansOrderChanged(){
            if(this.myPlans.items.length < this.myPlans.length) {
                // added new item
                this._createItem(this.myPlans[this.myPlans.length - 1]);
                this._sortItems(this.myPlans);
            } else {
                // updated existed item
                this._sortItems(this.myPlans);
                //TODO reanimate
            }
        }

        function _initItemList(listData){
            for(i = 0, len = listData.length; i < len; i++) this._createItem(listData[i]);
            this._sortItems(listData);
        }

        function _sortItems(listData){
            var i, len, list;
            var fakeContainer = $('<div>');
            var colorList = listData.colors;
            var orderList = listData.orderList;
            if(listData.items) listData.items.detach();
            for(i = 0, len = orderList.length; i < len; i++) fakeContainer.append(listData[orderList[i].index].item);
            var items = listData.items = fakeContainer.find('> *');
            this._updateItemsColor(items, colorList);
            this.topContainer.after(items);
            listData.tab.find('.num').html(items.length);
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

        function _onResize(e){
            this.scrollPane.onResize();
        }

        function show(currentNodes, previousSection, previousNodes){
            var self = this;
            var tabName = currentNodes[2] ? currentNodes[2] : DEFAULT_TAB_NAME;
            if(tabName === this.currentTabName) {
                self._setShown();
                return;
            }

            this.appear.apply(this, [currentNodes, true]);
            stageReference.onResize.add(_onResize, this);
            this._onResize();
            self._setShown();
        }

        function hide(currentSection, currentNodes){
            var self = this;
            var tabName = currentNodes[2] ? currentNodes[2] : DEFAULT_TAB_NAME;
            if(currentSection === this && tabName === this.currentTabName) {
                self._setHidden();
                return;
            }

            stageReference.onResize.remove(_onResize, this);

            if(currentSection !== this) {
                this.currentTabName = '';
            }
            self._setHidden();
        }


        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._initItemList = _initItemList;
        _p._createItem = _createItem;
        _p._updateItemsColor = _updateItemsColor;
        _p._sortItems = _sortItems;
        _p._onResize = _onResize;

        _p.show = show;
        _p.hide = hide;

        return ScheduleSection;
    }
)
