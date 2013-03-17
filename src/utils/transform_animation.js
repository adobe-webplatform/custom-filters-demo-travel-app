define(["utils/basic_animation",
        "utils/transform"], function(BasicAnimation, Transform) {
    
    var TransformAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._transform = new Transform();
        this._startTransform = null;
    };

    _.extend(TransformAnimation.prototype, BasicAnimation.prototype, {
        transform: function() {
            return this._transform;
        },

        startTransform: function() {
            if (!this._startTransform)
                this._startTransform = new Transform();
            return this._startTransform;
        },

        _internalStart: function(state, viewState, animationState) {
            animationState.startTransform = viewState.transform().clone();
        },

        _internalCompute: function(state, viewState, animationState) {
            if (animationState.started)
                state.requestFrame();
            var transform;
            if (this._startTransform)
                transform = animationState.startTransform.concat(this._startTransform.blend(animationState.percent, this._transform));
            else
                transform = animationState.startTransform.blend(animationState.percent, this._transform);
            viewState.transform().take(transform);
        }
    });

    return TransformAnimation;

});