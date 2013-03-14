define(['app', 
		'views/common/layer-view', 
		'views/common/measured-view', 
		'utils/request-animation-frame'], 
	function(app, LayerView, MeasuredView, requestAnimationFrame) {

	var MainView = LayerView.extend({

		$content: null,

		initialize: function() {
			requestAnimationFrame.on("before", this.onBeforeUpdate, this);
		},

		render: function() {
			this.$el.html("<a href='#'>Main View</a>");
			if (!this.$content)
				this.$content = $("<div />").appendTo(this.$el);

			var layer1 = new LayerView();
			var layer2 = new LayerView();

			this.$el.append(layer1.render().$el.addClass("blue-box"))
					.append(layer2.render().$el.addClass("red-box"));

			layer1.bounds().setX(100).setY(200).setWidth(100).setHeight(100);
			layer1.transform().rotate(20);

			layer2.bounds().setX(300).setY(300).setWidth(200).setHeight(100);
			layer2.transform().perspective(100).rotateX(20);

			var layer3 = new MeasuredView();
			layer3.bounds().setX(300).setY(300);
			this.$el.append(layer3.render().$el.addClass("green-box"));
			layer3.content().text("Box of the right size");
			layer3.updateSize();

			return this;
		},

		onBeforeUpdate: function() {
			this.layoutIfNeeded();
		},

		setContentView: function(view) {
			this.$content.html("");
			this.$content.append(view.render().$el);
		}
	});

	app.on("init", function() {
		app.mainView = new MainView({
			el: $("#main").get(0)
		}).render();
	});

	return MainView;

});