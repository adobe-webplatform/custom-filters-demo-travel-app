define(["utils/basic_animation",
        "utils/transform"], function(BasicAnimation, Transform) {
    
    var TransformAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._transform = new Transform();
    };

    _.extend(TransformAnimation.prototype, BasicAnimation.prototype, {
        transform: function() {
            return this._transform;
        },

        _internalStart: function(state, viewState, animationState) {
            animationState.startTransform = viewState.transform().clone();
        },

        _internalCompute: function(state, viewState, animationState) {
            if (animationState.started)
                state.requestFrame();
            viewState.transform().take(
                animationState.startTransform.blend(animationState.percent, this._transform));
        }
    });

    return TransformAnimation;

});