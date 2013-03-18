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

        weight: function() {
            return this._weight;
        },

        setWeight: function(weight) {
            this._weight = weight;
            return this;
        }

    });

    _.extend(LayoutParams, {
        FILL_PARENT: "fill-parent"
    });

    return LayoutParams;

});