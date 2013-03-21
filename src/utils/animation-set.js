define(["mobileui/utils/animation-controller",
        "mobileui/utils/animation",
        // Initialize all types of animations here.
        "mobileui/utils/transform-animation",
        "mobileui/utils/opacity-animation",
        "mobileui/utils/filter-animation"
        ], function(AnimationController, Animation) {

    var AnimationSet = function(view) {
        Animation.call(this, "animationSet");
        this._view = view;
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
            Animation.prototype.compute.call(this, state, this._view);
            if (!state.isSetActive())
                this.stop();
        }
    });

    return AnimationSet;

});