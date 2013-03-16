define(["views/common/layer-view"], function(LayerView) {

    var ContentView = LayerView.extend({
        render: function() {
            this.$el.addClass("js-content-view");
            return ContentView.__super__.render.call(this);
        }
    });

    return ContentView;

});