define(["app"],
    function(app) {

    var UrlCardViewMixin = {

        updateRouterLocation: function() {
            var url = this.url();
            if (!url)
                return;
            app.router.navigate(url, { trigger: false });
        }
    };

    return UrlCardViewMixin;

});