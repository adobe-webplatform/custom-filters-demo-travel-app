define(["mobileui/ui/navigator-card-view", "app"], function(NavigatorCardView, app) {

    var LocationView = NavigatorCardView.extend({
        initialize: function(options) {
            LocationView.__super__.initialize.call(this);
            this.on("activate", this._onViewActivated, this);
        },

        render: function() {
            this.$el.append("Location view");
            return LocationView.__super__.render.call(this);
        },

        _onViewActivated: function() {
            app.router.navigate("test/" + encodeURIComponent("Location View"), { trigger: false });
        }
    });

    return {
        label: "Location View",
        view: LocationView
    };

});