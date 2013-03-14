define(["utils/boilerplate"], function(boilerplate) {

    var requestAnimationFrame = boilerplate.lookupPrefix(window, "requestAnimationFrame");
    if (!requestAnimationFrame) {
        requestAnimationFrame = function(fn) {
            return setTimeout(fn, 0);
        };
    }

    var requestedCallbacks = null;

    var fn = _.extend(function(callback, order) {
        if (!requestedCallbacks) {
            requestedCallbacks = [];
            requestAnimationFrame(update);
        }
        requestedCallbacks.push(callback);
    }, Backbone.Events);

    function update() {
        fn.trigger("before");
        var callbacks = requestedCallbacks;
        requestedCallbacks = null;
        _.each(callbacks, function(fn) {
            fn();
        });
        fn.trigger("after");
    }

    return fn;
});