define(["mobileui/utils/filter"], function(Filter) {

    return Filter.registerCustomFilter("fold", "t shadow width",
        function(fn) {
            var width = fn._width * fn._t / 3;
            return "custom(url(style/shaders/fold.vert) " +
             "mix(url(style/shaders/fold.frag) multiply source-atop), " +
             "6 1 detached, t " + fn._t.toFixed(6) + ", shadow " + fn._shadow.toFixed(6) +
             ", transform translate(" + (-width).toFixed(6) + "px, 0) perspective(1500) translate(" + (width).toFixed(6) +
             "px, 0), mapDepth 150, minSpacing 0.001)";
    });

});