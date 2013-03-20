define(["mobileui/utils/basic-animation"], function(BasicAnimation) {

    var OpacityAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._opacity = 0;
        this._startOpacity = null;
    };

    _.extend(OpacityAnimation.prototype, BasicAnimation.prototype, {
        opacity: function() {
            return this._opacity;
        },

        setOpacity: function(opacity) {
            this._opacity = opacity;
            return this;
        },

        startOpacity: function() {
            return this._startOpacity;
        },

        setStartOpacity: function(opacity) {
            this._startOpacity = opacity;
            return this;
        },

        _internalStart: function(state, view, animationState) {
            animationState.startOpacity = view.opacity();
        },

        _internalCompute: function(state, view, animationState) {
            if (animationState.started)
                state.requestFrame();
            var opacity;
            if (this._startOpacity !== null)
                opacity = this._startOpacity * (1 - animationState.percent) +
                    animationState.percent * this._opacity;
            else
                opacity = animationState.startOpacity * (1 - animationState.percent) +
                    animationState.percent * this._opacity;
            view.setOpacity(opacity);
        }
    });

    return OpacityAnimation;

});