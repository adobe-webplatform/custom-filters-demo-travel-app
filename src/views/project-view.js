define(function() {

	return Backbone.View.extend({

		render: function() {
			this.$el.html("project-view: " + this.model);
			return this;
		}

	});

});