define(["mobileui/views/layer-view",
        "mobileui/views/layout-params"],
function(LayerView, LayoutParams) {

    var NavigatorContentView = LayerView.extend({
        initialize: function() {
            NavigatorContentView.__super__.initialize.call(this);
            this.setParams(new LayoutParams().matchParentWidth().fillParentHeight());
        },

        render: function() {
            this.$el.addClass("js-navigator-content-view");
            return NavigatorContentView.__super__.render.call(this);
        }
    });

    return NavigatorContentView;
});