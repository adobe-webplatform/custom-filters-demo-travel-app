define(['app', 
        'mobileui/views/common/layer-view', 
        'mobileui/views/common/measured-view',
        'mobileui/views/common/layout-view',
        'mobileui/views/common/scroll-view',
        'mobileui/utils/transform',
        'mobileui/utils/transform-animation'], 
    function(app, 
             LayerView,
             MeasuredView,
             LayoutView,
             ScrollView,
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
            layer1.$el.click(function() {
                layer0.setLayoutWithAnimation("vertical");
            });

            //layer1.transform().rotate(20);

            layer2.bounds().setWidth(200).setHeight(100);
            //layer2.transform().perspective(100).rotateY(20);
            layer2.$el.click(function() {
                layer0.setLayoutWithAnimation("horizontal");
            });

            var layer4 = new LayoutView();
            layer4.setLayout("vertical");

            layer4.bounds().setX(100);
            layer0.append(layer4.render().addClass("red-box"));
            layer4.append(new MeasuredView().render().setContent("Line 1"));
            layer4.append(new MeasuredView().render().setContent("Line 2 is super long"));
            layer4.append(new MeasuredView().render().setContent("Line 3"));
            layer4.append(new MeasuredView().render().setContent("Line 4"));
            layer4.setUseChildrenWidth(true);
            layer4.padding().setLeft(100).setTop(50).setBottom(10).setRight(60);

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
                layer0.beforeWithAnimation(layer3.render().addClass("green-box"), layer1);
                layer3.setContent("Box of the right size");

                layer5 = new MeasuredView();
                layer0.beforeWithAnimation(layer5.render().addClass("green-box"), layer4);
                layer5.setContent("Box of the right size<br /> - test");
            });

            layer4.$el.click(function() {
                if (!layer5)
                    return;
                if (layer5.parent())
                    layer5.detachWithAnimation();
                else
                    layer0.beforeWithAnimation(layer5, layer4);
            });

            var layer6 = new ScrollView();
            layer6.setContentView(new LayoutView().render().setLayout("vertical"));
            layer6.contentView()
                .setUseChildrenWidth(true)
                .append(new MeasuredView().render().setContent("Item 1"))
                .append(new MeasuredView().render().setContent("Item 2"))
                .append(new MeasuredView().render().setContent("Item 3"))
                .append(new MeasuredView().render().setContent("Item 4"))
                .append(new MeasuredView().render().setContent("Item 6"))
                .append(new MeasuredView().render().setContent("Item 7"))
                .append(new MeasuredView().render().setContent("Item 8"))
                .append(new MeasuredView().render().setContent("Item 9"));
            layer6.$el.addClass("green-box");
            layer6.bounds().setSize(100, 100);
            layer6.scrollTo(0, 100);
            layer0.append(layer6.render());


            var layer7 = new ScrollView();
            layer7.setContentView(new LayoutView().render().setLayout("horizontal"));
            layer7.contentView()
                .setUseChildrenWidth(true)
                .append(new MeasuredView().render().setContent("Item 1"))
                .append(new MeasuredView().render().setContent("Item 2"))
                .append(new MeasuredView().render().setContent("Item 3"))
                .append(new MeasuredView().render().setContent("Item 4"))
                .append(new MeasuredView().render().setContent("Item 6"))
                .append(new MeasuredView().render().setContent("Item 7"))
                .append(new MeasuredView().render().setContent("Item 8"))
                .append(new MeasuredView().render().setContent("Item 9"));
            layer7.$el.addClass("green-box");
            layer7.bounds().setSize(100, 100);
            layer7.scrollTo(100, 0);
            layer0.append(layer7.render());

            // setInterval(function() {
            //     if (!layer5)
            //         return;
            //     var layer6 = new MeasuredView();
            //     layer0.before(layer6.render().addClass("green-box"), layer4, true);
            //     layer6.setContent("Box of the right size<br /> - test");
            // }, 1000);

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