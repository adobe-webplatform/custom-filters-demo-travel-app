define(["utils/transform"], function(Transform) {

    var AnimationViewState = function() {
        this._transform = null;
    };

    _.extend(AnimationViewState.prototype, Backbone.Events, {
        transform: function() {
            if (!this._transform) {
                this._transform = new Transform();
                this._transform.on("change", this._invalidateTransform, this);
            }
            return this._transform;
        },

        blendTransform: function(viewTransform) {
            if (!this._transform)
                return viewTransform;
            return viewTransform.concat(this._transform);
        },

        _invalidateTransform: function() {
            this.trigger("invalidate", "transform");
        }
    });

    return AnimationViewState;
});