define(["views/common/content-view"], function(ContentView) {

	var ProjectsView = ContentView.extend({

		render: function() {
			this.$el.html("projects-view");
			
			this.$el.append(
				$("<ul />").append(this.model.map(function(model) {
					return $("<li />").append(
						$("<a />").attr("href", "#/project/" + model.get("id")).text(model.get("title"))
					);
			})));

			return ProjectsView.__super__.render.call(this);
		}

	});

	return ProjectsView;

});