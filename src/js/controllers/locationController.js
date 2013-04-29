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
        'mout/string/trim',
        'mout/string/slugify',
        'mout/array/unique'
    ],

    function(locationController, config, trim, slugify, unique) {

        var locations;
        var locationList;

        var _matchedKeyCaches = {};
        var _blurryMatchedKeyCaches = {};

        function init(){
            var location, hue;
            locations = locationController.locations = {};
            locationList = locationController.locationList = config.data.locations;
            for(var i = 0, len = locationList.length; i < len; i++) {
                location = locationList[i];
                location.index = i;

                hue = Math.random() * 360 | 0;
                location.bgColor = 'hsla('+ hue +',100%,' + (25 + Math.random() * 15) +'%,1)';
                location.color = 'hsla('+ hue +',100%,75%,1)';
                location.keywords = location.name.toLowerCase();
                locations[location.id] = location;
            }
        }

        function getMatched(key, value) {
            var keyCache = _matchedKeyCaches[key] || (_matchedKeyCaches[key] = {});
            if(keyCache[value]) return keyCache[value];
            var arr = keyCache[value] = [];
            for(var i = 0, len = locationList.length; i < len; i++) {
                if(locationList[i][key] == value){
                    arr.push(locationList[i]);
                }
            }
            return arr;
        }

        function getBlurryMatched(key, value) {
            value = slugifyText(value);
            if(value.length === 0) return locationList;

            var keyCache = _blurryMatchedKeyCaches[key] || (_blurryMatchedKeyCaches[key] = {});
            if(keyCache[value]) return keyCache[value];

            var i, j, valueLen, listLen, location, str;
            var arr = keyCache[value] = [];
            var values = unique(value.split('-'));
            for(i = 0, listLen = locationList.length; i < listLen; i++) {
                location = locationList[i];
                str = location[key];
                for(j = 0, valueLen = values.length; j < valueLen; j ++ ) {
                    if(str.indexOf(values[j]) > -1){
                        arr.push(location);
                        break;
                    }
                }
            }
            return arr;
        }

        function slugifyText(value) {
            return slugify(value).replace('--','-');
        }

        locationController.init = init;
        locationController.getMatched = getMatched;
        locationController.getBlurryMatched = getBlurryMatched;
        locationController.slugifyText = slugifyText;

        return locationController;

    }

);
