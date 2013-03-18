define(["mobileui/ui/navigator-card-view",
        "mobileui/views/scroll-view"], 
function(NavigatorCardView, ScrollView) {

    var ScrollCardView = NavigatorCardView.extend({
        
        initialize: function() {
            ScrollCardView.__super__.initialize.call(this);
            this._scrollView = new ScrollView();
            this._scrollView.matchParentSize();
            this.append(this._scrollView.render());
        },

        render: function() {
            this.$el.addClass("js-scroll-card-view");
            return ScrollCardView.__super__.render.call(this);
        },

        scrollView: function() {
            return this._scrollView;
        }

    });

    return ScrollCardView;
});