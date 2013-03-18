define(function() {

    var LayoutParams = function() {
        this._width = null;
        this._height = null;
        this._weight = 1;
    };

    _.extend(LayoutParams.prototype, {

        width: function() {
            return this._width;
        },

        setWidth: function(width) {
            this._width = width;
            return this;
        },

        fillParentWidth: function() {
            return this.setWidth(LayoutParams.FILL_PARENT);
        },

        matchParentWidth: function() {
            return this.setWidth(LayoutParams.MATCH_PARENT);
        },

        matchChildrenWidth: function() {
            return this.setWidth(LayoutParams.MATCH_CHILDREN);
        },

        height: function() {
            return this._height;
        },

        setHeight: function(height) {
            this._height = height;
            return this;
        },

        fillParentHeight: function() {
            return this.setHeight(LayoutParams.FILL_PARENT);
        },

        matchParentHeight: function() {
            return this.setHeight(LayoutParams.MATCH_PARENT);
        },

        matchChidlrenHeight: function() {
            return this.setHeight(LayoutParams.MATCH_CHILDREN);
        },

        matchParent: function() {
            return this
                .setWidth(LayoutParams.MATCH_PARENT)
                .setHeight(LayoutParams.MATCH_PARENT);
        },

        fillParent: function() {
            return this
                .setWidth(LayoutParams.FILL_PARENT)
                .setHeight(LayoutParams.FILL_PARENT);
        },

        matchChildren: function() {
            return this
                .setWidth(LayoutParams.MATCH_CHILDREN)
                .setHeight(LayoutParams.MATCH_CHILDREN);
        },

        weight: function() {
            return this._weight;
        },

        setWeight: function(weight) {
            this._weight = weight;
            return this;
        }

    });

    _.extend(LayoutParams, {
        FILL_PARENT: "fill-parent",
        MATCH_PARENT: "match-parent",
        MATCH_CHILDREN: "match-children"
    });

    return LayoutParams;

});