define(["utils/rect",
    "utils/transform",
    "utils/outsets",
    "utils/animation_set",
    "utils/request-animation-frame"
], function(Rect, Transform, Outsets, AnimationSet, requestAnimationFrame) {

    var LayerView = Backbone.View.extend({

        initialize: function() {
            LayerView.__super__.initialize.call(this);
            this._bounds = new Rect();
            this._transform = new Transform();
            this._margin = new Outsets();
            this._padding = new Outsets();
            this._animation = null;

            this._bounds.on("change:position", this._onPositionChanged, this);
            this._bounds.on("change:size", this._onSizeChanged, this);
            this._transform.on("change", this._onTransformChanged, this);
            this._padding.on("change", this._onPaddingChanged, this);
            this._margin.on("change", this._onMarginChanged, this);

            this._invalidationFlags = null;
            this._needsLayout = false;
        },

        animation: function() {
            if (!this._animation) {
                this._animation = new AnimationSet();
                this._animation.viewState().on("invalidate", this._onAnimationInvalidated, this);
            }
            return this._animation;
        },

        hasAnimation: function() {
            return !!this._animation;
        },

        setElement: function(el) {
            if (this.$el)
                this.$el.data("layer-view", null);
            LayerView.__super__.setElement.call(this, el);
            if (this.$el)
                this.$el.data("layer-view", this);
        },

        childrenViews: function() {
            var children = [];
            this.$el.children().each(function(i, child) {
                var layerView = $(child).data("layer-view");
                if (layerView)
                    children.push(layerView);
            });
            return children;
        },

        append: function(view) {
            this.$el.append(view.$el);
            return this._childAdded(view);
        },

        before: function(view, otherView) {
            otherView.$el.before(view.$el);
            return this._childAdded(view);
        },

        after: function(view, otherView) {
            otherView.$el.after(view.$el);
            return this._childAdded(view);
        },

        detach: function(view) {
            if (!view) {
                var parentView = this.parent();
                if (parentView)
                    parentView.detach(this);
                else
                    this.$el.detach();
                return this;
            }
            view.$el.detach();
            return this._childRemoved(view);
        },

        remove: function(view) {
            this.detach(view);
            this.$el.remove();
            return this;
        },

        _childAdded: function(view) {
            view.setNeedsLayout(true);
            this.setNeedsLayout(true);
            return this;
        },

        _childRemoved: function(view) {
            this.setNeedsLayout(true);
            return this;
        },

        addClass: function(className) {
            this.$el.addClass(className);
            return this;
        },

        removeClass: function(className) {
            this.$el.removeClass(className);
            return this;
        },

        parent: function() {
            var parent = this.$el.parent();
            for (; parent.length; parent = parent.parent()) {
                var layerView = parent.data("layer-view");
                if (layerView)
                    return layerView;
            }
            return null;
        },

        layoutIfNeeded: function() {
            if (!this._needsLayout)
                return;
            this.layout();
        },

        layoutChildren: function() {
            _.each(this.childrenViews(), function(view) {
                view.layoutIfNeeded();
            });
        },

        layout: function() {
            this.layoutChildren();
            this.setNeedsLayout(false);
        },

        setNeedsLayout: function(needsLayout) {
            if (this._needsLayout == needsLayout)
                return;
            this._needsLayout = needsLayout;
            if (needsLayout && this.$el.parent().length) {
                var parentView = this.parent();
                if (parentView) {
                    parentView.setNeedsLayout(needsLayout);
                } else {
                    requestAnimationFrame.once("before", this.onBeforeUpdate, this);
                }
            }
        },

        onBeforeUpdate: function() {
            this.layoutIfNeeded();
        },

        updateLayout: function() {
            this.setNeedsLayout(true);
            return this;
        },

        setBounds: function(bounds) {
            this._bounds.set(bounds);
        },

        bounds: function() {
            return this._bounds;
        },

        setMargin: function(margin) {
            this._margin.set(margin);
        },

        margin: function() {
            return this._margin;
        },

        setPadding: function(padding) {
            this._padding.set(padding);
        },

        padding: function() {
            return this._padding;
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
            var result = this._transform;
            if (this._animation)
                result = this._animation.viewState().blendTransform(result);
            this.$el.css("transform", result.toString());
        },

        _validatePadding: function() {
            this.$el.css("padding", this._padding.toCSSString("px"));
        },

        _validateMargin: function() {
            this.$el.css("margin", this._margin.toCSSString("px"));
        },

        _onPositionChanged: function() {
            this.invalidate("position");
        },

        _onSizeChanged: function() {
            this.invalidate("size");
        },

        _onTransformChanged: function() {
            this.invalidate("transform");
        },

        _onPaddingChanged: function() {
            this.invalidate("padding");
            this.setNeedsLayout(true);
        },

        _onMarginChanged: function() {
            this.invalidate("margin");
        },

        _onAnimationInvalidated: function(propertyName) {
            this.invalidate(propertyName);
        }
    });

    return LayerView;

});
