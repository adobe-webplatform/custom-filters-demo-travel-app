define(["utils/animation_controller", "utils/animation"], function(AnimationController, Animation) {

    var AnimationSet = function() {
        Animation.call(this, "animationSet");
    };

    _.extend(AnimationSet.prototype, Animation.prototype, {
        start: function() {
            AnimationController.instance.register(this);
        },

        stop: function() {
            AnimationController.instance.unregister(this);
        },

        _onAnimationResultChange: function() {
            this.trigger("change");
        },

        apply: function(animationViewState) {
            AnimationController.instance.apply(this, animationViewState);
        },

        compute: function(state) {
            state.prepareSet();
            Animation.prototype.compute.call(this, state);
            if (!state.isSetActive())
                this.stop();
        }
    });

});