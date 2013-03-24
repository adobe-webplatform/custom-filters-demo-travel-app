define(["mobileui/utils/boilerplate"], function(boilerplate) {

    var Cache = function() {
        this._cache = boilerplate.lookupPrefix(window, "applicationCache");
        if (!this._cache)
            return;
        this._cache.addEventListener("updateready", this._onCacheUpdateReady.bind(this));
    };

    _.extend(Cache.prototype, Backbone.Events, {
        _onCacheUpdateReady: function() {
            if (this._cache.status != this._cache.UPDATEREADY) {
                console.log("No cache update.");
                return;
            }
            console.log("Update ready.");
            this.trigger("updateready");
        },

        swapCache: function() {
            console.log("Swapping cache.");
            this.cache.swapCache();
            console.log("Reloading app.");
            window.location.reload();
        },

        checkForUpdates: function() {
            if (!this.cache)
                return;
            try {
                this._cache.update();
            } catch (e) {
                // FIXME: Opera throws an INVALID_STATE_ERR.
            }
        }
    });

    return new Cache();

});