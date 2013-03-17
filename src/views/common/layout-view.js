define(["views/common/layer-view",
    "views/common/vertical-layout"
    ], function(LayerView, VerticalLayout) {

    var LayoutView = LayerView.extend({

        initialize: function() {
            LayoutView.__super__.initialize.call(this);
            this.useChildrenWidth = false;
            this._layout = null;
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

        setUseChildrenWidth: function(value) {
            if (value == this.useChildrenWidth)
                return;
            this.useChildrenWidth = value;
            this.setNeedsLayout(true);
        }
    });

    return LayoutView;

});