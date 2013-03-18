define(["mobileui/views/common/layer-view"], function(LayerView) {

    var MeasuredView = LayerView.extend({
        render: function() {
            this.$el.addClass("js-measured-view");
            this.$contentView = this.createContentElement()
                .addClass("js-measured-view-content");
            this.$el.append(this.$contentView);
            return MeasuredView.__super__.render.call(this);
        },

        setContent: function(html) {
            this.$contentView.html(html);
            this.setNeedsLayout(true);
            return this;
        },

        content: function() {
            return this.$contentView;
        },

        createContentElement: function() {
            return $("<div />");
        },

        layout: function() {
            this.layoutChildren();
            this.bounds()
                .setWidth(this.$contentView.outerWidth())
                .setHeight(this.$contentView.outerHeight());
            this.setNeedsLayout(false);
        }
    });

    return MeasuredView;

});