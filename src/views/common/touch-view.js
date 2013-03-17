define([
    "views/common/layer-view",
    "views/common/touch-view-mixin"
],
function(LayerView, TouchViewMixin) {

    var TouchView = LayerView.extend(TouchViewMixin).extend({
        initialize: function() {
            TouchView.__super__.initialize.call(this);
            this.initializeTouchViewMixin();
        },

        render: function() {
            this.$el.addClass("js-touch-view");
            this.renderTouchViewMixin();
            return TouchView.__super__.render.call(this);
        }
    });

    return TouchView;
});