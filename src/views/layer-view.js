/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["mobileui/utils/rect",
        "mobileui/utils/transform",
        "mobileui/utils/filter",
        "mobileui/utils/outsets",
        "mobileui/utils/animation-set",
        "mobileui/utils/request-animation-frame",
        "mobileui/views/layout-params",
        "mobileui/views/touch-view-mixin",
        "mobileui/views/gesture-detector"
], function(Rect, Transform, Filter, Outsets, AnimationSet, requestAnimationFrame, LayoutParams, TouchViewMixin, GestureDetector) {

    var LayerView = Backbone.View.extend(TouchViewMixin).extend({

        initialize: function() {
            LayerView.__super__.initialize.call(this);
            this.initializeTouchViewMixin();
            this._bounds = new Rect();
            this._transform = new Transform();
            this._filter = new Filter();
            this._margin = new Outsets();
            this._padding = new Outsets();
            this._opacity = 1;
            this._animation = null;

            this._params = null;

            this._bounds.on("change:position", this._onPositionChanged, this);
            this._bounds.on("change:size", this._onSizeChanged, this);
            this._transform.on("change", this._onTransformChanged, this);
            this._filter.on("change", this._onFilterChanged, this);
            this._padding.on("change", this._onPaddingChanged, this);
            this._margin.on("change", this._onMarginChanged, this);

            this._invalidationFlags = null;
            this._needsLayout = false;
            this._state = LayerView.VISIBLE;
            this._needsTouchEvents = false;
            this._visible = true;
        },

        inlineUpdate: function() {
            requestAnimationFrame.runInlinesIfNeeded();
        },

        setNeedsTouchEvents: function(value) {
            if (this._needsTouchEvents == value)
                return this;
            if (this.$el && this.$el.length) {
                if (value)
                    this.installTouchEvents();
                else
                    this.removeTouchEvents();
            }
            this._needsTouchEvents = value;
            return this;
        },

        addGestureDetector: function() {
            if (!this._gestureDetector)
                this._gestureDetector = new GestureDetector(this);
        },

        animation: function() {
            if (!this._animation)
                this._animation = new AnimationSet(this);
            return this._animation;
        },

        hasAnimation: function() {
            return !!this._animation;
        },

        forceLayer: function() {
            // Force a 3D layer by activating the animation.
            this.animation();
            this.transform().clear();
        },

        setElement: function(el) {
            if (this.$el) {
                this.$el.data("layer-view", null);
                this.removeTouchEvents();
            }
            LayerView.__super__.setElement.call(this, el);
            if (this.$el) {
                this.$el.data("layer-view", this);
                if (this._needsTouchEvents)
                    this.installTouchEvents();
            }
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

        params: function() {
            return this._params;
        },

        setParams: function(params) {
            this._params = params;
            this.setNeedsLayout(true);
            return this;
        },

        matchParentSize: function() {
            this.setParams(new LayoutParams().matchParent());
            return this;
        },

        append: function(view) {
            requestAnimationFrame.setHadDOMUpdates();
            this.$el.append(view.$el);
            return this._childAdded(view, /* useAnimation */ false);
        },

        appendWithAnimation: function(view) {
            requestAnimationFrame.setHadDOMUpdates();
            this.$el.append(view.$el);
            return this._childAdded(view, /* useAnimation */ true);
        },

        before: function(view, otherView) {
            requestAnimationFrame.setHadDOMUpdates();
            otherView.$el.before(view.$el);
            return this._childAdded(view, /* useAnimation */ false);
        },

        beforeWithAnimation: function(view, otherView) {
            requestAnimationFrame.setHadDOMUpdates();
            otherView.$el.before(view.$el);
            return this._childAdded(view, /* useAnimation */ true);
        },

        after: function(view, otherView) {
            requestAnimationFrame.setHadDOMUpdates();
            otherView.$el.after(view.$el);
            return this._childAdded(view, /* useAnimation */ false);
        },

        afterWithAnimation: function(view, otherView) {
            requestAnimationFrame.setHadDOMUpdates();
            otherView.$el.after(view.$el);
            return this._childAdded(view, /* useAnimation */ true);
        },

        detachWithAnimation: function() {
            return this._internalDetachWithAnimation("detach");
        },

        removeWithAnimation: function() {
            return this._internalDetachWithAnimation("remove");
        },

        detach: function() {
            return this._internalDetach("detach");
        },

        remove: function() {
            return this._internalDetach("remove");
        },

        _internalDetachWithAnimation: function(detach) {
            if (this._state != LayerView.REMOVED) {
                var parentView = this.parent();
                if (parentView)
                    return parentView._childRemoved(this, detach, /*useAnimation*/ true);
                this._internalDetachRemove(detach);
            }
            return $.Deferred().resolveWith(this).promise();
        },

        _internalDetach: function(detach) {
            if (this._state == LayerView.REMOVED)
                return this;
            var parentView = this.parent();
            if (parentView)
                return parentView._childRemoved(this, detach, /* useAnimation */ false);
            this._internalDetachRemove(detach);
            return this;
        },

        _childAdded: function(view, useAnimation) {
            view.setNeedsLayout(true);
            this.setNeedsLayout(true);
            view._state = LayerView.VISIBLE;
            if (useAnimation) {
                view.everHadLayout = false;
                return this._animateAttach(view)
                    .then(function() { return view; });
            }
            return this;
        },

        _animateAttach: function(view) {
            return $.Deferred().resolveWith(view).promise();
        },

        _internalDetachRemove: function(detach) {
            requestAnimationFrame.setHadDOMUpdates();
            if (detach == "detach")
                this.$el.detach();
            else
                this.$el.remove();
        },

        _childRemoved: function(view, detach, useAnimation) {
            this.setNeedsLayout(true);
            view._state = LayerView.REMOVED;
            if (useAnimation) {
                return this._animateDetach(view).then(function() {
                    view._internalDetachRemove(detach);
                    return view;
                });
            } else {
                view._internalDetachRemove(detach);
            }
            return view;
        },

        _animateDetach: function(view) {
            return $.Deferred().resolveWith(view).promise();
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

        hide: function() {
            this._visible = false;
            this.invalidate("visibility");
            return this;
        },

        show: function() {
            this._visible = true;
            this.invalidate("visibility");
            return this;
        },

        visible: function() {
            return this._visible;
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
            this.setLayoutOnChildren();
            _.each(this.childrenViews(), function(view) {
                view.layoutIfNeeded();
            });
        },

        layoutBounds: function() {
            var params = this.params();
            if (!params)
                return;
            var parentView = this.parent();
            if (!parentView)
                return;
            if (params.width() == LayoutParams.MATCH_PARENT)
                this.bounds().setWidth(parentView.bounds().width());
            if (params.height() == LayoutParams.MATCH_PARENT)
                this.bounds().setHeight(parentView.bounds().height());
        },

        setLayoutOnChildren: function() {
            if (!this.checkInvalidationFlag("size"))
                return;
            _.each(this.childrenViews(), function(view) {
                view.setNeedsLayout(true);
            });
        },

        layout: function() {
            this.layoutBounds();
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

        setFilter: function(filter) {
            this._filter.set(filter);
        },

        filter: function() {
            return this._filter;
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

        checkInvalidationFlag: function(type) {
            return this._invalidationFlags ? this._invalidationFlags[type] : false;
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
            if (this._animation && !result.has3DTransforms())
                this.$el.css("transform", result.toString() + " translateZ(0)");
            else
                this.$el.css("transform", result.toString());
        },

        _validateFilter: function() {
            this.$el.css(Filter.propertyName, this._filter.toString());
        },

        _validateOpacity: function() {
            var result = this._opacity;
            this.$el.css("opacity", result);
        },

        _validateVisibility: function() {
            this.$el.toggleClass("js-layer-view-invisible", !this._visible);
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

        _onFilterChanged: function() {
            this.invalidate("filter");
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
        }
    });

    _.extend(LayerView, {
        VISIBLE: "visible",
        REMOVED: "removed"
    });

    return LayerView;

});
