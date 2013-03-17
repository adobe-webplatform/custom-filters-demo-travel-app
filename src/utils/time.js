define(["utils/boilerplate"], function(boilerplate) {

    var now = function() { return Date.now(); };

    var performance = boilerplate.lookupPrefix(window, "performance");
    if (performance) {
        var performanceNow = boilerplate.lookupPrefix(performance, "now");
        now = function() {
            return performanceNow.call(performance);
        };
    }

    return {
        now: now
    };

});