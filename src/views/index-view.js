define(function() {

	return Backbone.View.extend({

		render: function() {
			this.$el.html("index-view<br /><a href='#projects'>Projects</a>");
			return this;
		}

	});

});