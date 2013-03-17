define(["utils/transform", "views/common/linear-layout"], function(Transform, LinearLayout) {

    var VerticalLayout = function(containerView, options) {
        return LinearLayout(LinearLayout.Vertical, containerView, options);
    };

    return VerticalLayout;

});