define(["utils/transform", "views/common/linear-layout"], function(Transform, LinearLayout) {

    var HorizontalLayout = function(containerView, options) {
        return LinearLayout(LinearLayout.Horizontal, containerView, options);
    };

    return HorizontalLayout;

});