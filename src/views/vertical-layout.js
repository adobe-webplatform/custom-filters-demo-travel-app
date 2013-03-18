define(["mobileui/utils/transform", "mobileui/views/linear-layout"], function(Transform, LinearLayout) {

    var VerticalLayout = _.extend({}, LinearLayout, {
        direction: LinearLayout.Vertical
    });

    return VerticalLayout;

});