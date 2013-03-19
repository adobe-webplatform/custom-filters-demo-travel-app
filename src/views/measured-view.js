define(["mobileui/views/layer-view",
        "mobileui/views/layout-params"], function(LayerView, LayoutParams) {

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

        setTextContent: function(html) {
            this.$contentView.text(html);
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
            this.layoutBounds();
            this.layoutChildren();
            var params = this.params();
            if (!params || params.width() != LayoutParams.MATCH_PARENT)
                this.bounds().setWidth(this.$contentView.outerWidth());
            if (!params || params.height() != LayoutParams.MATCH_PARENT)
                this.bounds().setHeight(this.$contentView.outerHeight());
            this.setNeedsLayout(false);
        }
    });

    return MeasuredView;

});