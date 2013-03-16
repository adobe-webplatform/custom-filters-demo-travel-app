define("utils/transform",
    function(Transform) {

    var AnimationViewState = function() {
        this._transform = null;
    };

    _.extend(AnimationViewState.prototype, {
        transform: function() {
            if (!this._transform)
                this._transform = new Transform();
            return this._transform;
        },

        blendTransform: function(viewTransform) {
            if (!this._transform)
                return viewTransform;
            return viewTransform.concat(this._transform);
        }
    });

});