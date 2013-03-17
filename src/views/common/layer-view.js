define(["utils/rect",
    "utils/transform",
    "utils/outsets",
    "utils/animation-set",
    "utils/request-animation-frame"
], function(Rect, Transform, Outsets, AnimationSet, requestAnimationFrame) {

    var LayerView = Backbone.View.extend({

        initialize: function() {
            LayerView.__super__.initialize.call(this);
            this._bounds = new Rect();
            this._transform = new Transform();
            this._margin = new Outsets();
            this._padding = new Outsets();
            this._opacity = 1;
            this._animation = null;

            this._bounds.on("change:position", this._onPositionChanged, this);
            this._bounds.on("change:size", this._onSizeChanged, this);
            this._transform.on("change", this._onTransformChanged, this);
            this._padding.on("change", this._onPaddingChanged, this);
            this._margin.on("change", this._onMarginChanged, this);

            this._invalidationFlags = null;
            this._needsLayout = false;
            this._animationWait = null;
            this._animationDuration = null;
            this._state = LayerView.VISIBLE;
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

        append: function(view, useAnimation) {
            this.$el.append(view.$el);
            return this._childAdded(view, useAnimation);
        },

        before: function(view, otherView, useAnimation) {
            otherView.$el.before(view.$el);
            return this._childAdded(view, useAnimation);
        },

        after: function(view, otherView, useAnimation) {
            otherView.$el.after(view.$el);
            return this._childAdded(view, useAnimation);
        },

        detach: function(useAnimation) {
            if (this._state == LayerView.REMOVED)
                return;
            var parentView = this.parent();
            if (parentView)
                parentView._childRemoved(this, "detach", useAnimation);
            else
                this.$el.detach();
            return this;
        },

        remove: function(useAnimation) {
            if (this._state == LayerView.REMOVED) {
                this.$el.remove();
                return;
            }
            var parentView = this.parent();
            if (parentView)
                parentView._childRemoved(this, "remove", useAnimation);
            else
                this.$el.remove();
            return this;
        },

        _childAdded: function(view, useAnimation) {
            view.setNeedsLayout(true);
            this.setNeedsLayout(true);
            view._state = LayerView.VISIBLE;
            if (useAnimation) {
                view.everHadLayout = false;
                this._animateAttach(view);
            }
            return this;
        },

        _animateAttach: function(view) {
            this._animationWait = null;
            this._animationDuration = LayerView.AnimationDuration;
            view.animation().start().get("opacity").removeAll()
                .chain(LayerView.AnimationDuration).opacity(LayerView.AnimationDuration, 0, 1);
            view.animation().viewState().setOpacity(0);
        },

        _internalDetach: function(detach) {
            if (detach == "detach")
                this.$el.detach();
            else
                this.$el.remove();
        },

        _childRemoved: function(view, detach, useAnimation) {
            this.setNeedsLayout(true);
            view._state = LayerView.REMOVED;
            if (useAnimation) {
                this._animateDetach(view, function() {
                    view._internalDetach(detach);
                });
            } else {
                view._internalDetach(detach);
            }
            return this;
        },

        _animateDetach: function(view, callback) {
            this._animationDuration = LayerView.AnimationDuration;
            this._animationWait = LayerView.AnimationDuration * 2;
            view.animation().start().get("opacity").removeAll()
                .chain(LayerView.AnimationDuration)
                .opacity(LayerView.AnimationDuration, 1, 0);
            view.animation().once("stop", callback);
        },

        shouldIgnoreDuringLayout: function() {
            return this._state == LayerView.REMOVED;
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
                    requestAnimationFrame.once("layout", this.onBeforeUpdate, this).run();
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

        outerWidth: function() {
            return this.bounds().width() +
                this.padding().horizontal() +
                this.margin().horizontal();
        },

        outerHeight: function() {
            return this.bounds().height() +
                this.padding().vertical() +
                this.margin().vertical();
        },

        setTransform: function(transform) {
            this._transform.set(transform);
        },

        transform: function() {
            return this._transform;
        },

        opacity: function() {
            return this._opacity;
        },

        setOpacity: function(opacity) {
            this._opacity = opacity;
            this._onOpacityChanged();
            return this;
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
            if (result.has3DTransforms())
                this.$el.css("transform", result.toString());
            else
                this.$el.css("transform", result.toString() + " translateZ(0)");
        },

        _validateOpacity: function() {
            var result = this._opacity;
            if (this._animation)
                result = this._animation.viewState().blendOpacity(result);
            this.$el.css("opacity", result);
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

        _onOpacityChanged: function() {
            this.invalidate("opacity");
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

    _.extend(LayerView, {
        VISIBLE: "visible",
        REMOVED: "removed",

        AnimationDuration: 200
    });

    return LayerView;

});
