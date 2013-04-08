define(
    [
        'mout/math/lerp'
    ],
    function(lerp){

        var colorHelper = {};

        function generateShadeList(hueFrom, hueTo, saturationFrom, saturationTo, lightFrom, lightTo, step) {
            var i, ratio;
            var list = [];
            for(i = 0; i < step * 2; i++) {
                ratio = (i > step ? 2 * step - i : i) / step;
                list[i] = 'hsl(' + ~~(lerp(ratio, hueFrom, hueTo)) + ',' + ~~(lerp(ratio, saturationFrom, saturationTo)) + '%,' + ~~(lerp(ratio, lightFrom, lightTo)) + '%)';
            }
            return list;
        }

        colorHelper.generateShadeList = generateShadeList;

        return colorHelper;

    }

)