define(["utils/rect", "utils/transform", "utils/request-animation-frame"], function(Rect, Transform, requestAnimationFrame) {

    var LayerView = Backbone.View.extend({

        initialize: function() {
            LayerView.__super__.initialize.call(this);
            this._bounds = new Rect();
            this._transform = new Transform();
            this._bounds.on("change:position", this._onPositionChanged, this);
            this._bounds.on("change:size", this._onSizeChanged, this);
            this._transform.on("change", this._onTransformChanged, this);
            this._invalidationFlags = null;
        },

        setBounds: function(bounds) {
            this._bounds.set(bounds);
        },

        bounds: function() {
            return this._bounds;
        },

        setTransform: function(transform) {
            this._transform.set(transform);
        },

        transform: function() {
            return this._transform;
        },

        render: function() {
            this.$el.addClass("js-layer-view");
            this._validatePosition();
            this._validateSize();
            this._validateTransform();
            return this;
        },

        invalidate: function(type) {
            this._requestAnimationFrame();
            this._invalidationFlags[type] = true;
        },

        _requestAnimationFrame: function() {
            if (this._invalidationFlags)
                return;
            this._invalidationFlags = {};
            requestAnimationFrame(this._update.bind(this));
        },

        _update: function() {
            if (!this._invalidationFlags)
                return;
            var invalidationFlags = this._invalidationFlags;
            this._invalidationFlags = null;
            var self = this;
            _.each(invalidationFlags, function(enabled, type) {
                if (!enabled)
                    return;
                self._validate(type);
            });
            this.trigger("update");
        },

        _validate: function(type) {
            var fn = this["_validate" + _.string.capitalize(type)];
            if (fn)
                fn.call(this);
            else
                this.trigger("validate:" + type);
        },

        _validatePosition: function() {
            this.$el
                .css("left", this._bounds.x())
                .css("top", this._bounds.y());
        },

        _validateSize: function() {
            this.$el
                .css("width", this._bounds.width())
                .css("height", this._bounds.height());
        },

        _validateTransform: function() {
            this.$el.css("transform", this._transform.toString());
        },

        _onPositionChanged: function() {
            this.invalidate("position");
        },

        _onSizeChanged: function() {
            this.invalidate("size");
        },

        _onTransformChanged: function() {
            this.invalidate("transform");
        }
    });

    return LayerView;

});
