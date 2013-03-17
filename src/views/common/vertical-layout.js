define(["utils/transform"], function(Transform){

    var VerticalLayout = function(containerView, animationDuration) {
        var children = containerView.childrenViews(),
            maxWidth = 0,
            padding = containerView.padding(),
            offset = padding.top(),
            useChildrenWidth = containerView.useChildrenWidth;
        
        _.each(children, function(view) {
            view.layoutIfNeeded();
            var viewBounds = view.bounds();
            if (viewBounds.x() != padding.left() ||
                viewBounds.y() != offset) {
                var animationX = viewBounds.x(),
                    animationY = viewBounds.y();
                viewBounds
                    .setX(padding.left())
                    .setY(offset);
                if (animationDuration && view.everHadLayout) {
                    view.animation()
                        .inlineStart()
                        .get("layout")
                        .removeAll()
                        .chain()
                        .transform(animationDuration, 
                            Transform().translate(
                                animationX - viewBounds.x(), 
                                animationY - viewBounds.y()), 
                            Transform());
                }
            }
            view.everHadLayout = true;
            offset += view.outerHeight();
            if (useChildrenWidth)
                maxWidth = Math.max(maxWidth, viewBounds.width());
        });

        containerView.bounds().setHeight(offset - padding.top());
        if (useChildrenWidth)
            containerView.bounds().setWidth(maxWidth);
    };

    return VerticalLayout;

});