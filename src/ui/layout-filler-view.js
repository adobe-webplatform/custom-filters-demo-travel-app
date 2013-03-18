define(["mobileui/views/layout-view",
        "mobileui/views/layout-params"], 
function(LayoutView, LayoutParams) {

    var LayoutFillerView = LayoutView.extend({
        
        initialize: function() {
            LayoutFillerView.__super__.initialize.call(this);
            this.matchParentSize();
            this.setLayout("vertical");
        },

        render: function() {
            this.$el.addClass("js-layout-filler-view");
            return LayoutFillerView.__super__.render.call(this);
        }

    });

    return LayoutFillerView;
});