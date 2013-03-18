define(["mobileui/ui/html-card-view"], function(HtmlCardView) {

    var ProjectsView = HtmlCardView.extend({

        render: function() {
            this.$el.addClass("js-projects-view");
            this.contentView().content().append(
                $("<ul />").append(this.model.map(function(model) {
                    return $("<li />").append(
                        $("<a />").attr("href", "#/project/" + model.get("id")).text(model.get("title"))
                    );
            })));
            this.contentView().setNeedsLayout(true);

            return ProjectsView.__super__.render.call(this);
        }

    });

    return ProjectsView;

});