define(["utils/animation"], function(Animation) {

    var BasicAnimationState = function(time) {
        this.startTime = time;
        this.playDuration = 0;
        this.percent = 0;
        this.started = true;
    };

    var BasicAnimation = function(name) {
        Animation.call(this, name);
        this._duration = -1;
    };

    _.extend(BasicAnimation.prototype, Backbone.Events, {
        compute: function(state, viewState) {
            var animationState = state.get(this._id);
            if (!animationState) {
                animationState = new BasicAnimationState(state.time);
                state.set(this._id, animationState);
                this._internalStart(state, viewState, animationState);
                this.trigger("start");
            }
            animationState.playDuration = state.time - animationState.startTime;
            if (this._duration > 0) {
                animationState.percent = animationState.playDuration / this._duration;
                if (animationState.percent >= 1) {
                    animationState.percent = 1;
                    state.remove(this._id);
                    animationState.started = false;
                    this.trigger("stop");
                }
            }
            this._internalCompute(state, viewState, animationState);
        },

        _internalStart: function(state, viewState, animationState) {
        },

        _internalCompute: function(state, viewState, animationState) {
        },

        setDuration: function(duration) {
            this._duration = duration;
            return this;
        },

        duration: function() {
            return this._duration;
        }
    });

    return BasicAnimation;
});