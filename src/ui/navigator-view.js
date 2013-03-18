define(["mobileui/views/layout-view",
        "mobileui/views/layout-params",
        "mobileui/ui/navigator-top-bar-view",
        "mobileui/ui/navigator-content-view"], 
function(LayoutView, LayoutParams, NavigatorTopBarView, NavigatorContentView) {

    var NavigatorView = LayoutView.extend({
        initialize: function() {
            NavigatorView.__super__.initialize.call(this);
            this.setLayout("vertical");
            this.setParams(new LayoutParams().matchParent());
            this._topBarView = new NavigatorTopBarView();
            this.append(this._topBarView.render());
            this._contentView = new NavigatorContentView();
            this.append(this._contentView.render());
        },

        render: function() {
            this.$el.addClass("js-navigator-view");
            return NavigatorView.__super__.render.call(this);
        },

        contentView: function() {
            return this._contentView;
        }
    });

    return NavigatorView;

});