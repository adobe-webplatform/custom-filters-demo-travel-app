define(['app'], function(app) {

	var MainView = Backbone.View.extend({

		$content: null,

		render: function() {
			this.$el.html("Main View");
			if (!this.$content)
				this.$content = $("<div />").appendTo(this.$el);
			return this;
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