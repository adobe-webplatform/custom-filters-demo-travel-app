define(["mobileui/ui/scroll-card-view",
        "mobileui/views/layout-params",
        "mobileui/views/measured-view"],
function(ScrollCardView, LayoutParams, MeasuredView) {

    var HtmlCardView = ScrollCardView.extend({

        initialize: function() {
            HtmlCardView.__super__.initialize.call(this);

            this._contentView = new MeasuredView();
            this._contentView.setParams(new LayoutParams().matchParentWidth());
            this.scrollView().setContentView(this._contentView.render());
        },

        render: function() {
            this.$el.addClass("js-html-card-view");
            return HtmlCardView.__super__.render.call(this);
        },

        contentView: function() {
            return this._contentView;
        }

    });

    return HtmlCardView;
});