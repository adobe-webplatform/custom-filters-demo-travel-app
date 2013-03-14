define(["views/common/layer-view"], function(LayerView) {

	var VerticalBoxView = LayerView.extend({
		render: function() {
			this.$el.addClass("js-vertical-box-view");
			return VerticalBoxView.__super__.render.call(this);
		},

		layout: function() {
			var children = this.childrenViews(),
				offset = 0;
			_.each(children, function(view) {
                view.layoutIfNeeded();
                view.bounds().setY(offset);
                offset += view.bounds().height();
            });
            this.bounds().setHeight(offset);
            this.setNeedsLayout(false);
		}
	});

	return VerticalBoxView;

});