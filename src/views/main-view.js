define(['app', 
        'views/common/layer-view', 
        'views/common/measured-view',
        'views/common/layout-view',
        'utils/transform',
        'utils/transform_animation'], 
    function(app, 
             LayerView,
             MeasuredView,
             LayoutView,
             Transform,
             TransformAnimation) {

    var MainView = LayerView.extend({

        $content: null,

        initialize: function() {
        },

        render: function() {
            this.$el.html("<a href='#'>Main View</a>");
            if (!this.$content)
                this.$content = $("<div />").appendTo(this.$el);

            var layer0 = new LayoutView();
            layer0.setLayout("vertical");

            var layer1 = new LayerView();
            var layer2 = new LayerView();

            layer0.append(layer1.render().addClass("blue-box"))
                .append(layer2.render().addClass("red-box"));

            layer1.bounds().setWidth(100).setHeight(100);
            //layer1.transform().rotate(20);

            layer2.bounds().setWidth(200).setHeight(100);
            //layer2.transform().perspective(100).rotateY(20);

            var layer4 = new LayoutView();
            layer4.setLayout("vertical");

            layer4.bounds().setX(100);
            layer0.append(layer4.render().addClass("red-box"));
            layer4.append(new MeasuredView().render().setContent("Line 1"));
            layer4.append(new MeasuredView().render().setContent("Line 2 is super long"));
            layer4.append(new MeasuredView().render().setContent("Line 3"));
            layer4.append(new MeasuredView().render().setContent("Line 4"));
            layer4.setUseChildrenWidth(true);
            layer4.padding().setLeft(100).setTop(200).setBottom(10).setRight(60);

            // layer4.animation().chain()
            //     .transform(100, Transform().rotate(100));
                // .wait(500)
                // .transform(100, Transform().rotate(0))
                // .wait(500)
                // .transform(100, Transform().rotate(30))
                // .wait(500)
                // .transform(100, Transform().rotate(-30))
                // .wait(500)
                // .transform(100, Transform().rotate(0));

            var layer5;

            layer4.animation().chain(10);
            layer4.animation().start().once("stop", function() {
                var layer3 = new MeasuredView();
                layer0.before(layer3.render().addClass("green-box"), layer1, true);
                layer3.setContent("Box of the right size");

                layer5 = new MeasuredView();
                layer0.before(layer5.render().addClass("green-box"), layer4, true);
                layer5.setContent("Box of the right size");
            });

            layer4.$el.click(function() {
                if (layer5.parent())
                    layer5.detach(true);
                else
                    layer0.before(layer5, layer4, true);
            });

            layer0.bounds().setY(100);

            this.append(layer0.render());

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