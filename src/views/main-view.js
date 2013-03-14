define(['app', 
        'views/common/layer-view', 
        'views/common/measured-view',
        'views/common/vertical-box-view'], 
    function(app, 
             LayerView,
             MeasuredView,
             VerticalBoxView) {

    var MainView = LayerView.extend({

        $content: null,

        initialize: function() {
        },

        render: function() {
            this.$el.html("<a href='#'>Main View</a>");
            if (!this.$content)
                this.$content = $("<div />").appendTo(this.$el);

            var layer1 = new LayerView();
            var layer2 = new LayerView();

            this.append(layer1.render().addClass("blue-box"))
                .append(layer2.render().addClass("red-box"));

            layer1.bounds().setX(100).setY(200).setWidth(100).setHeight(100);
            layer1.transform().rotate(20);

            layer2.bounds().setX(300).setY(300).setWidth(200).setHeight(100);
            layer2.transform().perspective(100).rotateX(20);

            var layer3 = new MeasuredView();
            layer3.bounds().setX(300).setY(300);
            this.append(layer3.render().addClass("green-box"));
            layer3.setContent("Box of the right size");

            var layer4 = new VerticalBoxView();
            layer4.bounds().setX(100).setY(50);
            this.append(layer4.render().addClass("red-box"));
            layer4.append(new MeasuredView().render().setContent("Line 1"));
            layer4.append(new MeasuredView().render().setContent("Line 2 is super long"));
            layer4.append(new MeasuredView().render().setContent("Line 3"));
            layer4.append(new MeasuredView().render().setContent("Line 4"));
            layer4.setUseChildrenWidth(true);

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