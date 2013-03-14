define(["utils/boilerplate"], function(boilerplate) {

    var requestAnimationFrame = boilerplate.lookupPrefix(window, "requestAnimationFrame");
    if (!requestAnimationFrame) {
        requestAnimationFrame = function(fn) {
            return setTimeout(fn, 0);
        };
    }

    var requestedCallbacks = null;

    function update() {
        var callbacks = requestedCallbacks;
        requestedCallbacks = null;
        _.each(callbacks, function(fn) {
            fn();
        });
    }

    return function(callback) {
        if (!requestedCallbacks) {
            requestedCallbacks = [];
            requestAnimationFrame(update);
        }
        requestedCallbacks.push(callback);
    };

});