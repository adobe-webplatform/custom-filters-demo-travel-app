define(["mobileui/ui/html-card-view"], function(HtmlCardView) {

    var IndexView = HtmlCardView.extend({

        render: function() {
            this.$el.addClass("js-index-view");
            this.contentView().setContent("index-view<br /><a href='#projects'>Projects</a>");
            return IndexView.__super__.render.call(this);
        }

    });

    return IndexView;

});