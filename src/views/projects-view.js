define(function() {

	return Backbone.View.extend({

		render: function() {
			this.$el.html("projects-view");
			for (var i = 0; i < 10; ++i) {
				this.$el.append($("<a />").attr("href", "#/project/" + i).html("Project " + i));
			}
			return this;
		}

	});

});