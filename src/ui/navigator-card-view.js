define(["mobileui/views/layer-view",
        "mobileui/views/layout-params"],
function(LayerView, LayoutParams) {

    var NavigatorCardView = LayerView.extend({

        initialize: function() {
            NavigatorCardView.__super__.initialize.call(this);
            this.matchParentSize();
            this._navigatorView = null;
            this.on("activate", this.updateRouterLocation, this);
        },

        render: function() {
            this.$el.addClass("js-navigator-card-view");
            return NavigatorCardView.__super__.render.call(this);
        },

        // Called by the navigator when this view is set active.
        _setNavigatorView: function(navigatorView) {
            this._navigatorView = navigatorView;
            this.trigger("change:navigatorView");
            this.trigger(this._navigatorView ? "attached" : "detached");
            return this;
        },

        updateRouterLocation: function() {
            // override this method.
        },

        navigatorView: function() {
            return this._navigatorView;
        },

        topBarView: function() {
            return this._navigatorView ? this._navigatorView.topBarView() : null;
        }

    });

    return NavigatorCardView;
});