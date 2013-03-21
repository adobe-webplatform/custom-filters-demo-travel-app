define(["mobileui/utils/basic-animation",
        "mobileui/utils/filter"], function(BasicAnimation, Filter) {

    var FilterAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._filter = new Filter();
        this._startFilter = null;
    };

    _.extend(FilterAnimation.prototype, BasicAnimation.prototype, {
        getFilter: function() {
            return this._filter;
        },

        startFilter: function() {
            if (!this._startFilter)
                this._startFilter = new Transform();
            return this._startFilter;
        },

        _internalStart: function(state, view, animationState) {
            animationState.startFilter = view.filter().clone();
        },

        _internalCompute: function(state, view, animationState) {
            if (animationState.started)
                state.requestFrame();
            var filter;
            if (this._startFilter)
                filter = this._startFilter.blend(animationState.timingFunctionPercent, this._filter);
            else
                filter = animationState.startFilter.blend(animationState.timingFunctionPercent, this._filter);
            view.filter().take(filter);
        }
    });

    return FilterAnimation;

});