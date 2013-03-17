define(['app', 
        'views/common/layer-view', 
        'views/common/measured-view',
        'views/common/vertical-box-view',
        'utils/transform',
        'utils/transform_animation'], 
    function(app, 
             LayerView,
             MeasuredView,
             VerticalBoxView,
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

            var layer0 = new VerticalBoxView();

            var layer1 = new LayerView();
            var layer2 = new LayerView();

            layer0.append(layer1.render().addClass("blue-box"))
                .append(layer2.render().addClass("red-box"));

            layer1.bounds().setWidth(100).setHeight(100);
            layer1.transform().rotate(20);

            layer2.bounds().setWidth(200).setHeight(100);
            layer2.transform().perspective(100).rotateY(20);

            var layer3 = new MeasuredView();
            layer0.append(layer3.render().addClass("green-box"));
            layer3.setContent("Box of the right size");

            var layer4 = new VerticalBoxView();
            layer4.bounds().setX(100);
            layer0.append(layer4.render().addClass("red-box"));
            layer4.append(new MeasuredView().render().setContent("Line 1"));
            layer4.append(new MeasuredView().render().setContent("Line 2 is super long"));
            layer4.append(new MeasuredView().render().setContent("Line 3"));
            layer4.append(new MeasuredView().render().setContent("Line 4"));
            layer4.setUseChildrenWidth(true);
            layer4.padding().setLeft(100).setTop(200).setBottom(10).setRight(60);

            layer4.animation().chain()
                .transform(1000, new Transform().rotate(100))
                .wait(1000)
                .transform(1000, new Transform().rotate(0));

            layer4.animation().start().once("stop", function() {
                console.log("animation stopped");
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