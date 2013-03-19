define(["mobileui/ui/scroll-card-view"], function(ScrollCardView) {

    var WidgetsTestView = ScrollCardView.extend({

        initialize: function() {
            WidgetsTestView.__super__.initialize.call(this);
        }

    });

    return {
        label: "Widgets",
        view: WidgetsTestView
    };

});