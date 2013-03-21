define(["mobileui/ui/navigator-card-view",
        "mobileui/ui/list-view",
        "mobileui/views/layout-params",
        "app"],
    function(NavigatorCardView, ListView, LayoutParams, app) {

    var TouchListView = NavigatorCardView.extend({

        initialize: function(options) {
            TouchListView.__super__.initialize.call(this);
            this._listView = new ListView().matchParentSize()
                .setItemRendererFactory(this._onItemRendererFactory.bind(this))
                .setCollection(this.model)
                .setScrollDirection("none");
            this._listView.contentView().matchParentSize();
            this.append(this._listView.render());
            this.on("activate", this._onActivate, this);
            this.on("deactivate", this._onDeactivate, this);
            this._useVerticalLayout = null;
            // Force a 3D layer.
            this.animation();
            this.transform().clear();
        },

        listView: function() {
            return this._listView;
        },

        render: function() {
            this.$el.addClass("js-touch-list-view");
            return TouchListView.__super__.render.call(this);
        },

        _onItemSelected: function(selectedView) {
            var self = this;
            var selectedViewIndex = this._listView.indexOfView(selectedView);
            this.model.each(function(model, index) {
                var view = self._listView.itemView(model);
                if (!view || view == selectedView)
                    return;
                view.animateViewSwitch(Math.abs(selectedViewIndex - index));
            });
        },

        _onActivate: function(options) {
            if (!options.goingBack)
                return;
            var self = this, promises = [];
            this.model.each(function(model, index) {
                var view = self._listView.itemView(model);
                if (view)
                    promises.push(view.startAnimations(index));
            });
            options.promise = $.when.apply(null, promises);
        },

        _onDeactivate: function() {
            var self = this;
            this.model.each(function(model) {
                var view = self._listView.itemView(model);
                if (view)
                    view.resetAnimations();
            });
        },

        setUseVerticalLayout: function(useVerticalLayout) {
            if (this._useVerticalLayout == useVerticalLayout)
                return;
            if (useVerticalLayout)
                this.setVerticalLayout();
            else
                this.setHorizontalLayout();
        },

        _internalShouldUseVerticalLayout: function() {
            return true;
        },

        layout: function() {
            this.setUseVerticalLayout(this._internalShouldUseVerticalLayout());
            TouchListView.__super__.layout.call(this);
        },

        setVerticalLayout: function() {
            this._useVerticalLayout = true;
            var self = this;
            this.model.each(function(model) {
                var view = self._listView.itemView(model);
                if (!view)
                    return;
                view.setVerticalLayout();
            });
            this._listView.contentView().setLayout("vertical");
        },

        setHorizontalLayout: function() {
            this._useVerticalLayout = false;
            var self = this;
            this.model.each(function(model) {
                var view = self._listView.itemView(model);
                if (!view)
                    return;
                view.setHorizontalLayout();
            });
            this._listView.contentView().setLayout("horizontal");
        }

    });

    return TouchListView;

});