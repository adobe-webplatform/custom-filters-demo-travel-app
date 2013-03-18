define(["mobileui/utils/transform", "mobileui/views/common/linear-layout"], function(Transform, LinearLayout) {

    var VerticalLayout = _.extend({}, LinearLayout, {
        direction: LinearLayout.Vertical
    });

    return VerticalLayout;

});