define(["utils/boilerplate"], function(boilerplate) {

    var now = Date.now();

    var performance = boilerplate.lookupPrefix(window, "performance");
    if (performance)
        now = boilerplate.lookupPrefix(performance, "now");

    return {
        now: now
    };

});