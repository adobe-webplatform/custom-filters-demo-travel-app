(function(){
    Modernizr.addTest('customfilter', function () {

        var prop = 'filter';
        var prefixedProp = ['WebkitFilter', 'MozFilter', 'msFilter', 'OFilter', 'filter'];
        var prefixCSS = ['-webkit-filter', '-moz-filter', '-ms-filter', '-o-filter', 'filter'];
        var val = 'custom(url(data:text/plain;base64,))';
        var computedStyle;

        for(var i = 0, len = prefixCSS.length; i < len; i++) {
            Modernizr.testStyles('#modernizr { ' + prefixCSS[i] + ': ' + val + '; }', function (el, rule) {
                computedStyle = window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prefixCSS[i]) : '';
            });
            if(computedStyle && computedStyle.indexOf('custom') === 0) {
                Modernizr.__prefixedFilter = prefixedProp[i];
                return true;
            }
        }
        return false;
    });
}());
