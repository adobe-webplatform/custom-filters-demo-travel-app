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
            var location;
            locations = locationController.locations = {};
            locationList = locationController.locationList = config.data.locations;
            for(var i = 0, len = locationList.length; i < len; i++) {
                location = locationList[i];
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
            value = trim(value);
            var keyCache = _blurryMatchedKeyCaches[key] || (_blurryMatchedKeyCaches[key] = {});
            if(keyCache[value]) return keyCache[value];
            var i, j, valueLen, listLen, location, str;
            var arr = keyCache[value] = [];
            var values = unique(slugify(value).replace('--','-').split('-'));
            for(i = 0, listLen = locationList.length; i < listLen; i++) {
                location = locationList[i];
                str = location[key];
                for(j = 0, valueLen = values.length; j < valueLen; j ++ ) {
                    if(str.indexOf(values[i]) > -1){
                        arr.push(location);
                        break;
                    }
                }
            }
            return arr;
        }

        locationController.init = init;
        locationController.getMatched = getMatched;
        locationController.getBlurryMatched = getBlurryMatched;

        return locationController;

    }

);
