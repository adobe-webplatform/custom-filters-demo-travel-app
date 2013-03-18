define(["mobileui/utils/transform", "mobileui/views/linear-layout"], function(Transform, LinearLayout) {

    var HorizontalLayout = _.extend({}, LinearLayout, {
        direction: LinearLayout.Horizontal
    });

    return HorizontalLayout;

});