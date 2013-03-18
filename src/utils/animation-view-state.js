define(["mobileui/utils/transform"], function(Transform) {

    var AnimationViewState = function() {
        this._transform = null;
        this._opacity = 1;
    };

    _.extend(AnimationViewState.prototype, Backbone.Events, {
        transform: function() {
            if (!this._transform) {
                this._transform = new Transform();
                this._transform.on("change", this._invalidateTransform, this);
            }
            return this._transform;
        },

        setOpacity: function(opacity) {
            this._opacity = opacity;
            this._invalidateOpacity();
        },

        opacity: function() {
            return this._opacity;
        },

        blendTransform: function(viewTransform) {
            if (!this._transform)
                return viewTransform;
            return viewTransform.concat(this._transform);
        },

        blendOpacity: function(viewOpacity) {
            return this._opacity * viewOpacity;
        },

        _invalidateTransform: function() {
            this.trigger("invalidate", "transform");
        },

        _invalidateOpacity: function() {
            this.trigger("invalidate", "opacity");
        }
    });

    return AnimationViewState;
});