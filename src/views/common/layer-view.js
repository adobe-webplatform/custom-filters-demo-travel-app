define(function() {

	return Backbone.View.extend({
		render: function() {
			this.$el.addClass("js-layer-view");
			return this;
		}
	});

});