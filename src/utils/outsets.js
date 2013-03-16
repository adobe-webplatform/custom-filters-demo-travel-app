define(function() {

    var Outsets = function() {
        this._left = 0;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
    };

    Outsets.prototype = _.extend({}, Backbone.Events, {
        
        left: function() { return this._left; },
        top: function() { return this._top; },
        right: function() { return this._right; },
        bottom: function() { return this._bottom; },

        setLeft: function(left) { this._left = left; this._changedHorizontal(); return this; },
        setRight: function(right) { this._right = right; this._changedHorizontal(); return this; },

        setTop: function(top) { this._top = top; this._changedVertical(); return this; },
        setBottom: function(bottom) { this._bottom = bottom; this._changedVertical(); return this; },

        set: function(other) {
            var verticalChanged = 
                this._left != other.left() ||
                this._right != other.right();
            var horizontalChanged = 
                this._top != other.top() ||
                this._bottom != other.bottom();
            if (!verticalChanged && !horizontalChanged)
                return;
            this._left = bounds.left();
            this._right = bounds.right();
            this._top = bounds.top();
            this._bottom = bounds.bottom();
            
            if (verticalChanged)
                this.trigger("change:vertical");
            if (horizontalChanged)
                this.trigger("change:horizontal");
            this.trigger("change");
            return this;
        },

        toCSSString: function(units) {
            return [
                this._top + units,
                this._right + units,
                this._bottom + units,
                this._left + units
            ].join(" ");
        },

        _changedHorizontal: function() {
            this.trigger("change:horizontal");
            this.trigger("change");
        },

        _changedVertical: function() {
            this.trigger("change:vertical");
            this.trigger("change");
        }

    });

    return Outsets;
});