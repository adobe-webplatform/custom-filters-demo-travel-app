define(function() {

	return Backbone.View.extend({

		render: function() {
			this.$el.html("project-view: " + this.model.get("title"));
			return this;
		}

	});

});