define(["mobileui/ui/navigator-card-view", "app"],
    function(NavigatorCardView, app) {

    var AppCardView = NavigatorCardView.extend({
        url: function() {
            return null;
        },

        updateRouterLocation: function() {
            var url = this.url();
            if (!url)
                return;
            app.router.navigate(url, { trigger: false });
        }
    });

    return AppCardView;

});