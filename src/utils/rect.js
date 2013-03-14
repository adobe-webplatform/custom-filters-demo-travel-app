define(function() {

	var Rect = function() {
		this._x = 0;
		this._y = 0;
		this._width = 0;
		this._height = 0;
	};

	Rect.prototype = _.extend({}, Backbone.Events, {
		isEmpty: function() {
			return !this._width && !this._height;
		},

		x: function() { return this._x; },
		y: function() { return this._y; },
		width: function() { return this._width; },
		height: function() { return this._height; },

		right: function() { return this._x + this._width; },
		bottom: function() { return this._y + this._height; },

		setX: function(x) { this._x = x; this._changedPosition(); return this; },
		setY: function(y) { this._y = y; this._changedPosition(); return this; },

		setWidth: function(width) { this._width = width; this._changedSize(); return this; },
		setHeight: function(height) { this._height = height; this._changedSize(); return this; },

		set: function(bounds) {
			var positionChanged = 
				this._x != bounds.x() ||
				this._y != bounds.y();
			var sizeChanged = 
				this._width != bounds.width() ||
				this._height != bounds.height();
			if (!positionChanged && !sizeChanged)
				return;
			this._x = bounds.x();
			this._y = bounds.y();
			this._width = bounds.width();
			this._height = bounds.height();
			
			if (positionChanged)
				this.trigger("change:position");
			if (sizeChanged)
				this.trigger("change:size");
			this.trigger("change");
			return this;
		},

		alignRight: function(right) {
			return this.setX(right - this.width());
		},

		alignBottom: function(bottom) {
			return this.setY(bottom - this.height());
		},

		_changedPosition: function() {
			this.trigger("change:position");
			this.trigger("change");
		},

		_changedSize: function() {
			this.trigger("change:size");
			this.trigger("change");
		}

	});

	return Rect;
});