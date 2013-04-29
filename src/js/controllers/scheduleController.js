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
 define(
    [
        'exports',
        'config',
        'jquery',
        'signals',
        'ui/schedulePrompt',
        'locationController',
        'sectionController',
        'helpers/datetimeHelper',
        'stageReference'
    ],

    function(scheduleController, config, $, signals, schedulePrompt, locationController, sectionController, datetimeHelper, stageReference) {

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
                    note: '',
                    is_new: true
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

        function save(item){
            if(item.is_new) {
                myPlans.push(item);
            }
            _parseItem(item);
            _generateOrderList(myPlans);
            onOrderChanged.dispatch(item);
            setTimeout(function(){
                sectionController.goTo('home/schedule/my-plans');
            }, 800);
        }

        scheduleController.init = init;

        scheduleController.showPrompt = showPrompt;
        scheduleController.hidePrompt = hidePrompt;
        scheduleController.save = save;

        return scheduleController;

    }

);
