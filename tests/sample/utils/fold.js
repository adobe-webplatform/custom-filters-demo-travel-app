define(["mobileui/utils/filter"], function(Filter) {

    return Filter.registerCustomFilter("fold", "t shadow", Filter.createCustomFilterGenerator(
            ["custom(url(style/shaders/fold.vert) ",
             "mix(url(style/shaders/fold.frag) multiply source-atop), ", 
                "8 50 border-box, ",
                "t ", "?", ",",
                "shadow ", "?", ",",
                "transform translate(-25%, 0) perspective(2000) translate(25%, 0), spins 0, phase 0, mapDepth 100, mapCurve 0, minSpacing 0, useColoredBack 1, backColor 0.5 0.5 0.5 1)"
            ]));

});