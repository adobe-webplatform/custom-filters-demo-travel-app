/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
                    var space = Math.ceil(spacePerWeight * params.weight());
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
                        view.transform().set(startTransform);
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
        }
    };

    return LinearLayout;

});