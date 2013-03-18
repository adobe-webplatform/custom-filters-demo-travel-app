define(["mobileui/views/layer-view",
        "mobileui/views/layout-params"], 
function(LayerView, LayoutParams) {

    var NavigatorCardView = LayerView.extend({
        
        initialize: function() {
            NavigatorCardView.__super__.initialize.call(this);
            this.matchParentSize();
        },

        render: function() {
            this.$el.addClass("js-navigator-card-view");
            return NavigatorCardView.__super__.render.call(this);
        }

    });

    return NavigatorCardView;
});