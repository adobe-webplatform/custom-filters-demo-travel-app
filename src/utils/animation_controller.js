define(["utils/time", "utils/animation_view_state"], function(Time, AnimationViewState) {

    var AnimationState = function() {
        this.time = -1;
        this.previousTime = -1;
        this._nextInterval = -1;
        this._setStarted = false;
    };

    _.extend(AnimationState, {
        updateTime: function() {
            this.previousTime = time;
            this.time = Time.now();
            this.delta = (this.previousTime >= 0) ? this.time - this.previousTime : 0;
            this._nextInterval = -1;
        },

        prepareSet: function() {
            this._setStarted = true;
        },

        isSetActive: function() {
            return this._setStarted;
        },

        nextInterval: function() {
            return this._nextInterval;
        },

        requestTimer: function(interval) {
            if (interval < 0)
                throw new Error("Invalid interval value " + interval);
            this._setStarted = true;
            if (this._nextInterval == -1) {
                this._nextInterval = interval;
                return;
            }
            this._nextInterval = Math.min(this._nextInterval, interval);
        },

        requestFixedTimer: function(time) {
            this._setStarted = true;
            this.requestTimer(time, this.time);
        }
    });

    var AnimationController = function() {
        this._animations = [];
        this._state = new AnimationState();
        this._lastAnimationId = 0;
        this._nextTimerId = null;
        this._timerCallbak = this._onTimerFired.bind(this);
    };

    _.extend(AnimationController.prototype, Backbone.Events, {
        allocateAnimationId: function() {
            return ++this._lastAnimationId;
        },

        register: function(animationSet) {
            if (this._animations.indexOf(animationSet) != -1)
                return;
            this._animations.push(animationSet);
            animationSet.on("change:animation", this._onAnimationPropertyChanged, this);
        },

        unregister: function(animationSet) {
            var index = this._animations.indexOf(animationSet);
            if (index == -1)
                return;
            animationSet.off("change:animation", this._onAnimationPropertyChanged, this);
            this._animations.splice(index, 1);
        },

        _setTimer: function(interval) {
            // Remove any old timer and update it to throw in that amount.
            if (this._nextTimerId) {
                clearTimeout(this._nextTimerId);
                this._nextTimerId = null;
            }
            if (interval == -1)
                return;
            this._nextTimerId = setTimeout(this._timerCallbak, interval);
        },

        _onTimerFired: function() {
            this.compute();
        },

        _onAnimationPropertyChanged: function() {
            this.compute();
        },

        compute: function() {
            this._state.updateTime();
            _.each(this._animations, function(animationSet) {
                animationSet.compute(state);
            });
            this._setTimer(state.nextInterval());
        },

        applyValues: function(animation, viewState) {
            animation.applyValues(viewState, this._state);
        }
    });

    AnimationController.instance = new AnimationController();

    return AnimationController;

});