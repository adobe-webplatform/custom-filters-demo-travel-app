define(["mobileui/utils/basic-animation",
        "mobileui/utils/transform"], function(BasicAnimation, Transform) {
    
    var TransformAnimation = function(name) {
        BasicAnimation.call(this, name);
        this._transform = new Transform();
        this._startTransform = null;
    };

    _.extend(TransformAnimation.prototype, BasicAnimation.prototype, {
        getTransform: function() {
            return this._transform;
        },

        startTransform: function() {
            if (!this._startTransform)
                this._startTransform = new Transform();
            return this._startTransform;
        },

        _internalStart: function(state, view, animationState) {
            animationState.startTransform = view.transform().clone();
        },

        _internalCompute: function(state, view, animationState) {
            if (animationState.started)
                state.requestFrame();
            var transform;
            if (this._startTransform)
                transform = this._startTransform.blend(animationState.timingFunctionPercent, this._transform);
            else
                transform = animationState.startTransform.blend(animationState.timingFunctionPercent, this._transform);
            view.transform().take(transform);
        }
    });

    return TransformAnimation;

});