define(
    [
        'exports',
        'config',
        'jquery',
        'signals',
        'ui/schedulePrompt',
        'locationController',
        'helpers/datetimeHelper',
        'stageReference'
    ],

    function(scheduleController, config, $, signals, schedulePrompt, locationController, datetimeHelper, stageReference) {

        var undef;

        var _transform3DStyle = config.transform3DStyle;

        var events = scheduleController.events = [];
        var myPlans = scheduleController.myPlans = [];

        var onOrderChanged = scheduleController.onOrderChanged = new signals.Signal();

        function init(){
            events.push.apply(events, config.data.schedules.events);
            myPlans.push.apply(myPlans, config.data.schedules.my_plans);
            _parseList(events);
            _parseList(myPlans);
            schedulePrompt.init();
        }

        function _parseList(list) {
            for(var i = 0, len = list.length; i < len; i++) _parseItem(list[i]);
            _generateOrderList(list);
        }

        function _parseItem(item) {
            item.name = locationController.locations[item.location_id].name;
            item.timestamp = datetimeHelper.dateStringToTimestamp(item.datetime);
            item.shortdate = item.datetime.substr(5,5);
        }

        function _generateOrderList(list){
            var orderList = [];
            for(var i = 0, len = list.length; i < len; i++) orderList[i] = {index: i, timestamp: list[i].timestamp};
            orderList.sort(function(a, b){
                return a.timestamp > b.timestamp ? 1 : a.timestamp < b.timestamp ? -1 : 0;
            });
            list.orderList = orderList;
        }

        function showPrompt(arg, isEvent){
            var item;
            if(typeof arg === 'string') {
                item = {
                    location_id: arg,
                    datetime: datetimeHelper.timestampToDateString(+new Date + 86400000),
                    note: ''
                };
                _parseItem(item);
                schedulePrompt.show(item);
            } else {
                item = arg;
                schedulePrompt.show(item, isEvent);
            }
        }

        function hidePrompt(){
            schedulePrompt.hide();
        }

        function save(item, dateChanged){
            if(item.order === undef) {
                myPlans.push(item);
            }
            if(dateChanged) {
                _parseItem(item);
                _generateOrderList(myPlans);
                onOrderChanged.dispatch();
            }
        }

        scheduleController.init = init;

        scheduleController.showPrompt = showPrompt;
        scheduleController.hidePrompt = hidePrompt;
        scheduleController.save = save;

        return scheduleController;

    }

);
