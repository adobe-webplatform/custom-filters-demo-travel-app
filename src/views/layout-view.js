define(["mobileui/views/layer-view",
        "mobileui/views/vertical-layout",
        "mobileui/views/horizontal-layout"
    ], function(LayerView, VerticalLayout, HorizontalLayout) {

    var LayoutView = LayerView.extend({

        initialize: function() {
            LayoutView.__super__.initialize.call(this);
            this._layout = null;
            this._animationWait = null;
            this._animationDuration = null;
            this._layoutPromise = null;
        },

        render: function() {
            this.$el.addClass("js-vertical-box-view");
            return LayoutView.__super__.render.call(this);
        },

        _internalComputeLayout: function(layout) {
            if (layout == "vertical")
                return VerticalLayout;
            if (layout == "horizontal")
                return HorizontalLayout;
            return layout;
        },

        getLayout: function() {
            return this._layout;
        },

        setLayout: function(layout) {
            layout = this._internalComputeLayout(layout);
            if (this._layout === layout)
                return this;
            this._layout = layout;
            this._animationWait = null;
            this._animationDuration = null;
            this._layoutPromise = null;
            this.setNeedsLayout(true);
            return this;
        },

        setLayoutWithAnimation: function(layout) {
            layout = this._internalComputeLayout(layout);
            if (this._layout === layout)
                return $.Deferred().resolveWith(this).promise();
            this._layout = layout;
            this._animationWait = null;
            this._animationDuration = LayoutView.AnimationDuration;
            this.setNeedsLayout(true);
            this._layoutPromise = $.Deferred();
            return this._layoutPromise.promise();
        },

        layout: function() {
            if (this._layout) {
                this.layoutBounds();
                this.setLayoutOnChildren();
                this._layout.layout(this, {
                    wait: this._animationWait,
                    duration: this._animationDuration,
                    promise: this._layoutPromise
                });
                this._animationWait = null;
                this._animationDuration = null;
                this._layoutPromise = null;
                this.setNeedsLayout(false);
            } else {
                LayoutView.__super__.layout.call(this);
            }
        },

        _animateAttach: function(view) {
            this._animationWait = null;
            this._animationDuration = LayoutView.AnimationDuration;
            view.animation().start().get("opacity").removeAll()
                // Dummy wait until the layout animation is finished.
                .chain(LayoutView.AnimationDuration)
                .opacity(LayoutView.AnimationDuration, 0, 1);
            view.setOpacity(0);
            return view.animation().promise();
        },

        _animateDetach: function(view, callback) {
            this._animationDuration = LayoutView.AnimationDuration;
            this._animationWait = LayoutView.AnimationDuration * 2;
            view.animation().start().get("opacity").removeAll()
                .chain(LayoutView.AnimationDuration)
                .opacity(LayoutView.AnimationDuration, 1, 0)
                // Inject another dummy wait, so that layout animation is also finished.
                .wait(this._animationDuration);
            return view.animation().promise().then(function() {
                // Reset the opacity to 1 after we remove the object.
                if (view.hasAnimation() && !view.opacity())
                    view.setOpacity(1);
            });
        }
    });

    LayoutView.AnimationDuration = 200;

    return LayoutView;

});