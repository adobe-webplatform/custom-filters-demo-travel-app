define(["mobileui/utils/transform"], function(Transform){
    

    var LinearLayout = {
        
        Vertical: "vertical",
        Horizontal: "horizontal",

        direction: null,

        layout: function(containerView, options) {
            var children = containerView.childrenViews(),
                isVertical = this.direction == LinearLayout.Vertical,
                padding = containerView.padding(),
                offset = isVertical ? padding.top() : padding.left(),
                computeChildrenSize = isVertical ? containerView.useChildrenWidth : containerView.useChildrenHeight,
                maxChildrenSize = 0,
                promiseList = [];
            
            _.each(children, function(view) {
                view.layoutIfNeeded();
                var viewBounds = view.bounds(),
                    newX = isVertical ? padding.left() : offset,
                    newY = isVertical ? offset : padding.top();

                if (viewBounds.x() != newX ||
                    viewBounds.y() != newY) {
                    if ((options.wait || options.duration) && view.everHadLayout) {
                        var startTransform = Transform().translate(
                            viewBounds.x() - newX, 
                            viewBounds.y() - newY);
                        view.animation().viewState().transform().set(startTransform);
                        view.animation()
                            .inlineStart()
                            .get("layout")
                            .removeAll()
                            .chain(options.wait)
                            .transform(options.duration, Transform());
                        promiseList.push(view.animation().promise());
                    }
                    viewBounds.setX(newX).setY(newY);
                }
                view.everHadLayout = true;
                if (!view.shouldIgnoreDuringLayout())
                    offset += isVertical ? view.outerHeight() : view.outerWidth();
                if (computeChildrenSize)
                    maxChildrenSize = Math.max(maxChildrenSize, isVertical ? viewBounds.width() : viewBounds.height());
            });

            if (isVertical) {
                containerView.bounds().setHeight(offset - padding.top());
                if (computeChildrenSize)
                    containerView.bounds().setWidth(maxChildrenSize);
            } else {
                containerView.bounds().setWidth(offset - padding.left());
                if (computeChildrenSize)
                    containerView.bounds().setHeight(maxChildrenSize);
            }

            if (options.promise) {
                $.when.apply(null, promiseList).then(function() {
                    options.promise.resolveWith(containerView);
                });
            }
        },

        scroll: function(scrollView, options) {
            var contentView = scrollView.contentView();
            contentView
                .transform()
                .get("translate")
                .setX(-options.left).setY(-options.top);
        }
    };

    return LinearLayout;

});