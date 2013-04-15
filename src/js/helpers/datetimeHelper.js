define(
    function(){

        var datetimeHelper = {};

        var _date = new Date();

        function _fillZero(num, digit){
            var digits = Math.pow(10, digit - 1);
            return num < digits ? (num + digits * 10).toString().substr(1) : num.toString();
        }

        function timestampToDateString(timestamp) {
            _date.setTime(timestamp);
            return _date.getFullYear() + '-' + _fillZero(_date.getMonth() + 1, 2) + '-' + _fillZero(_date.getDate(), 2) + 'T' + _fillZero(_date.getHours(), 2) + ':' + _fillZero(_date.getMinutes(), 2);
        }

        function dateStringToTimestamp(dateString) {
            var arr = dateString.split(/[-:T]/g);
            _date.setFullYear(parseInt(arr[0], 10));
            _date.setMonth(parseInt(arr[1], 10) - 1);
            _date.setDate(parseInt(arr[2], 10));
            _date.setHours(parseInt(arr[3], 10));
            _date.setMinutes(parseInt(arr[4], 10));
            return _date.getTime();
        }

        datetimeHelper.timestampToDateString = timestampToDateString;
        datetimeHelper.dateStringToTimestamp = dateStringToTimestamp;

        return datetimeHelper;

    }

);
