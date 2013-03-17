define(["views/common/layer-view",
    "views/common/vertical-layout"
    ], function(LayerView, VerticalLayout) {

    var LayoutView = LayerView.extend({

        initialize: function() {
            LayoutView.__super__.initialize.call(this);
            this.useChildrenWidth = false;
            this._layout = null;
            this._animationWait = null;
            this._animationDuration = null;
        },

        render: function() {
            this.$el.addClass("js-vertical-box-view");
            return LayoutView.__super__.render.call(this);
        },

        setLayout: function(layout) {
            if (layout == "vertical")
                this._layout = VerticalLayout;
            else
                this._layout = layout;
            this.setNeedsLayout(true);
        },

        layout: function() {
            if (this._layout) {
                this._layout(this, this._animationWait, this._animationDuration);
                this._animationWait = null;
                this._animationDuration = null;
            }
            this.setNeedsLayout(false);
        },

        _animateAttach: function(view) {
            this._animationWait = null;
            this._animationDuration = LayoutView.AnimationDuration;
            view.animation().start().get("opacity").removeAll()
                // Dummy wait until the layout animation is finished.
                .chain(LayoutView.AnimationDuration)
                .opacity(LayoutView.AnimationDuration, 0, 1);
            view.animation().viewState().setOpacity(0);
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
                if (view.hasAnimation() && !view.animation().viewState().opacity())
                    view.animation().viewState().setOpacity(1);
            });
        },

        setUseChildrenWidth: function(value) {
            if (value == this.useChildrenWidth)
                return;
            this.useChildrenWidth = value;
            this.setNeedsLayout(true);
        }
    });

    LayoutView.AnimationDuration = 200;

    return LayoutView;

});