define(["mobileui/ui/html-card-view"], function(HtmlCardView) {

    var ProjectView = HtmlCardView.extend({

        render: function() {
            this.$el.addClass("js-project-view");
            this.contentView().setContent("project-view: " + this.model.get("title"));
            return ProjectView.__super__.render.call(this);
        }

    });

    return ProjectView;
});