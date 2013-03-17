define(["utils/transform"], function(Transform){

    var VerticalLayout = function(containerView, animationWait, animationDuration) {
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
                if ((animationWait || animationDuration) && view.everHadLayout) {
                    var startTransform = Transform().translate(
                        animationX - viewBounds.x(), 
                        animationY - viewBounds.y());
                    view.animation().viewState().transform().set(startTransform);
                    view.animation()
                        .inlineStart()
                        .get("layout")
                        .removeAll()
                        .chain(animationWait)
                        .transform(animationDuration, Transform());
                }
            }
            view.everHadLayout = true;
            if (!view.shouldIgnoreDuringLayout())
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