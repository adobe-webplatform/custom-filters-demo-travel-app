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

define(["require"], function(require) {

    function InjectorState(globalView, parentView, parentState) {
        this.globalView = globalView;
        this.parentView = parentView;
        this.parentState = null;
    }

    _.extend(InjectorState.prototype, {
        pushView: function(view) {
            view.readViewAttributes();
            view.render();
            this.setContextView("data-name", this.globalView, view);
            this.setContextView("data-parent-name", this.parentView, view);
            var viewContext = view.$el.attr("data-context"),
                globalView = this.globalView;
            if (viewContext === "local")
                globalView = view;
            return new InjectorState(globalView, view, this);
        },

        setContextView: function(attribute, globalView, view) {
            var viewName = view.$el.attr(attribute);
            if (!viewName)
                return;
            var setterName = "set" + _.string.capitalize(viewName);
            if (_.isFunction(globalView[setterName]))
                globalView[setterName].call(globalView, view);
            else
                globalView[name] = view;
        }
    });

    function ViewInjector() {
    }

    _.extend(ViewInjector.prototype, {
        convertViews: function(state, children) {
            var self = this,
                wait = $.Deferred(),
                waitList = [];
            children.each(function(i, child) {
                child = $(child);
                var viewName = child.attr("data-view");
                if (viewName === undefined) {
                    var childrenWait = self.convertViews(state, child.children());
                    if (childrenWait)
                        waitList.push(childrenWait);
                    return;
                }
                // FIXME: Make sure that the optimizer will be able to include all of the views
                // during the compile time. Shall we preparse the content?
                var requireWait = $.Deferred();
                require([viewName], function(ViewConstructor) {
                    var view = new ViewConstructor({ el: child }),
                        newState = state.pushView(view),
                        childrenWait = self.convertViews(newState, child.children());
                    $.when(childrenWait).then(function() {
                        requireWait.resolve();
                    });
                });
                waitList.push(requireWait.promise());
            });
            if (!waitList.length)
                return null;
            $.when.call(null, waitList).then(function() {
                wait.resolve();
            });
            return wait;
        },

        convert: function(globalStateView, startingView) {
            if (!startingView)
                startingView = globalStateView;
            var state = new InjectorState(globalStateView, startingView);
            return this.convertViews(state, startingView.$el.children()) || $.Deferred().resolve().promise();
        }
    });

    return ViewInjector;
});