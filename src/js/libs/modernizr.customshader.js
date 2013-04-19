(function(){
    Modernizr.addTest('customfilter', function () {
        // it returns no prefixed filter in Chrome when we use Modernizr.prefix() and using un-prefixed filter doesn't work. For now just hardcode the Webkit vendor.
        // var prop = Modernizr.prefixed('filter');

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
