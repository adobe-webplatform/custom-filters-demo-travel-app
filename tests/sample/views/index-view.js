define(["mobileui/views/content-view"], function(ContentView) {

    var IndexView = ContentView.extend({

        render: function() {
            this.$el.html("index-view<br /><a href='#projects'>Projects</a>");
            return IndexView.__super__.render.call(this);
        }

    });

    return IndexView;

});