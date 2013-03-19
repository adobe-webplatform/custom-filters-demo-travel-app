define(["mobileui/ui/html-card-view"], function(HtmlCardView) {

    var IndexView = HtmlCardView.extend({

        render: function() {
            this.$el.addClass("js-index-view");
            this.contentView().setContent("index-view<br /><a href='#projects'>Projects</a><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />test");
            return IndexView.__super__.render.call(this);
        }

    });

    return IndexView;

});