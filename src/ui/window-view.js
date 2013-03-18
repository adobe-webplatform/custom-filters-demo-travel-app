define(["mobileui/views/layout-view"], function(LayoutView) {
    
    var WindowView = LayoutView.extend({
        initialize: function() {
            WindowView.__super__.initialize.call(this);
            $(window).on("resize", this._onWindowResize.bind(this));
            this._onWindowResize();
        },

        render: function() {
            this.$el.addClass("js-window-view");
            return WindowView.__super__.render.call(this);
        },

        _onWindowResize: function() {
            this.bounds()
                .setSize(window.innerWidth, window.innerHeight);
            this.setNeedsLayout(true);
        }
    });

    return WindowView;
});