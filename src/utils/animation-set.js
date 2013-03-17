define(["utils/animation-controller",
        "utils/animation-view-state",
        "utils/animation",
        // Initialize all types of animations here.
        "utils/transform-animation",
        "utils/opacity-animation"
        ], function(AnimationController, AnimationViewState, Animation) {

    var AnimationSet = function() {
        Animation.call(this, "animationSet");
        this._viewState = new AnimationViewState();
    };

    _.extend(AnimationSet.prototype, Animation.prototype, {
        start: function() {
            if (AnimationController.instance.register(this))
                this.trigger("start");
            return this;
        },

        inlineStart: function() {
            this.start();
            AnimationController.instance.runOnRequestAnimationFrame();
            return this;
        },

        stop: function() {
            if (AnimationController.instance.unregister(this))
                this.trigger("stop");
            return this;
        },

        compute: function(state) {
            state.prepareSet();
            Animation.prototype.compute.call(this, state, this._viewState);
            if (!state.isSetActive())
                this.stop();
        },

        viewState: function() {
            return this._viewState;
        }
    });

    return AnimationSet;

});