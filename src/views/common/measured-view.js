define(["views/common/layer-view"], function(LayerView) {

	var MeasuredView = LayerView.extend({
		render: function() {
			this.$el.addClass("js-measured-view");
			this.$contentView = this.createContentElement()
				.addClass("js-measured-view-content");
			this.$el.append(this.$contentView);
			return MeasuredView.__super__.render.call(this);
		},

		content: function() {
			return this.$contentView;
		},

		createContentElement: function() {
			return $("<div />");
		},

		layout: function() {
			MeasuredView.__super__.layout.call(this);
			this.bounds()
				.setWidth(this.$contentView.outerWidth())
				.setHeight(this.$contentView.outerHeight());
		},

		updateSize: function() {
			this.setNeedsLayout(true);
		}
	});

	return MeasuredView;

});