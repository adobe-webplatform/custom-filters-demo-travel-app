define(["views/common/content-view"], function(ContentView) {

	var ProjectView = ContentView.extend({

		render: function() {
			this.$el.html("project-view: " + this.model.get("title"));
			return ProjectView.__super__.render.call(this);
		}

	});
	
	return ProjectView;
});