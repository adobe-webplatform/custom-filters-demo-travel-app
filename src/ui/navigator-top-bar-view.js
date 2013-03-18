define(["mobileui/views/layout-view",
        "mobileui/views/layout-params"], 
function(LayoutView, LayoutParams) {

    var NavigatorTopBarView = LayoutView.extend({
        initialize: function() {
            NavigatorTopBarView.__super__.initialize.call(this);
            this.bounds().setHeight(NavigatorTopBarView.height);
            this.setParams(new LayoutParams().matchParentWidth());
            this.setLayout("horizontal");
        },

        render: function() {
            this.$el.addClass("js-navigator-top-bar-view");
            return NavigatorTopBarView.__super__.render.call(this);
        }
    });

    _.extend(NavigatorTopBarView, {
        height: 50
    });

    return NavigatorTopBarView;
});