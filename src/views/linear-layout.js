define(["mobileui/utils/transform",
        "mobileui/views/layout-params"], function(Transform, LayoutParams) {

    function fillsParent(params, isVertical) {
        return isVertical ? (params.height() == LayoutParams.FILL_PARENT)
            : (params.width() == LayoutParams.FILL_PARENT);
    }

    function matchChildren(params, isVertical) {
        return isVertical ? (params.width() == LayoutParams.MATCH_CHILDREN)
            : (params.height() == LayoutParams.MATCH_CHILDREN);
    }

    var LinearLayout = {

        Vertical: "vertical",
        Horizontal: "horizontal",

        direction: null,

        layout: function(containerView, options) {
            var children = containerView.childrenViews(),
                isVertical = this.direction == LinearLayout.Vertical,
                padding = containerView.padding(),
                offset = 0,
                containerParams = containerView.params(),
                computeChildrenSize = containerParams ? matchChildren(containerParams, isVertical) : false,
                maxChildrenSize = 0,
                promiseList = [],
                childrenWeight = 0,
                hasParentFillers = false,
                spacePerWeight = 0;

            _.each(children, function(view) {
                var params = view.params();
                if (params && fillsParent(params, isVertical)) {
                    childrenWeight += params.weight();
                    hasParentFillers = true;
                    return;
                }
                view.layoutIfNeeded();
                if (!view.shouldIgnoreDuringLayout())
                    offset += isVertical ? view.outerHeight() : view.outerWidth();
            });

            if (hasParentFillers) {
                var totalSpace = (isVertical ? containerView.bounds().height() : containerView.bounds().width()),
                    remainingSpace = totalSpace - offset;
                spacePerWeight = (childrenWeight > 0) ? remainingSpace / childrenWeight : 0;
            }
            offset = isVertical ? padding.top() : padding.left();

            _.each(children, function(view) {
                var params = view.params(),
                    viewBounds = view.bounds(),
                    newX = isVertical ? padding.left() : offset,
                    newY = isVertical ? offset : padding.top();
                if (params && fillsParent(params, isVertical)) {
                    var space = spacePerWeight * params.weight();
                    if (isVertical)
                        viewBounds.setHeight(space);
                    else
                        viewBounds.setWidth(space);
                    view.layoutIfNeeded();
                }
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
                if (!hasParentFillers && (!containerParams || containerParams.height() == LayoutParams.MATCH_CHILDREN))
                    containerView.bounds().setHeight(offset - padding.top());
                if (computeChildrenSize)
                    containerView.bounds().setWidth(maxChildrenSize);
            } else {
                if (!hasParentFillers && (!containerParams || containerParams.width() == LayoutParams.MATCH_CHILDREN))
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