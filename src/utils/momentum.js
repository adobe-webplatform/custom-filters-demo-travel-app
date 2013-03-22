define(["mobileui/utils/time"], function(Time) {

    function computeDirection(x) { return x >= 0 ? 1 : -1; }

    var Momentum = function(duration) {
        this._duration = duration;
        this._friction = 0.005;
        this.reset();
    };

    _.extend(Momentum.prototype, Backbone.Events, {
        setDuration: function(duration) {
            this._duration = duration;
            return this;
        },

        reset: function(startValue) {
            this._startValue = startValue;
            this._currentValue = startValue;
            this._startTime = Time.now();
            this._direction = 0;
        },

        computeDelta: function() {
            var time = Time.now(),
                duration = time - this._startTime;
            if (!duration)
                return 0;
            var velocity = (this._currentValue - this._startValue) / duration;
            return Math.max(0, velocity * velocity * this._duration - this._friction * this._duration * this._duration) * computeDirection(velocity);
        },

        compute: function() {
            return this._currentValue + this.computeDelta();
        },

        injectValue: function(value) {
            var direction = computeDirection(this._currentValue - this._startValue);
            if (this._direction != direction) {
                this._direction = direction;
                this._startTime = Time.now();
                this._startValue = this._currentValue;
            }
            this._currentValue = value;
        },

        direction: function() {
            return this._direction;
        }
    });

    return Momentum;

});