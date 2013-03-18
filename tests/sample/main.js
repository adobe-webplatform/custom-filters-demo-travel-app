define(
[
    'app',
    'router',
    'views/main-view'
], 

function(app) {

    $(function() {
        app.trigger("init");
        app.trigger("start");
    });

});