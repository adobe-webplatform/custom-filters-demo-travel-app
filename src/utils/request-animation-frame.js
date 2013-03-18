define(["mobileui/utils/boilerplate"], function(boilerplate) {

    var requestAnimationFrame = boilerplate.lookupPrefix(window, "requestAnimationFrame");
    if (!requestAnimationFrame) {
        requestAnimationFrame = function(fn) {
            return setTimeout(fn, 0);
        };
    }

    var requestedCallbacks = null;

    var fn = _.extend(function(callback) {
        if (!requestedCallbacks) {
            requestedCallbacks = [];
            requestAnimationFrame(update);
        }
        if (callback)
            requestedCallbacks.push(callback);
    }, Backbone.Events, {
        run: function() {
            fn(null);
        }
    });

    function update() {
        fn.trigger("layout");
        fn.trigger("animation");
        while (requestedCallbacks && requestedCallbacks.length) {
            var callbacks = requestedCallbacks;
            requestedCallbacks = null;
            _.each(callbacks, function(fn) {
                fn();
            });
        }
        fn.trigger("after");
    }

    return fn;
});