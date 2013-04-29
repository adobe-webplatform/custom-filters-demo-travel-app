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
