define(["utils/time",
    "utils/request-animation-frame"], function(Time, requestAnimationFrame) {

    var frameRateInterval = 1000 / 60;

    var AnimationState = function() {
        this.time = -1;
        this.previousTime = -1;
        this._nextInterval = -1;
        this._setStarted = false;
        this._stateValues = {};
        this._pendingCommit = false;
    };

    _.extend(AnimationState.prototype, {
        updateTime: function() {
            this.previousTime = this.time;
            this.time = Time.now();
            this.delta = (this.previousTime >= 0) ? this.time - this.previousTime : 0;
            this._nextInterval = -1;
        },

        prepareSet: function() {
            this._setStarted = false;
        },

        isSetActive: function() {
            return this._setStarted;
        },

        nextInterval: function() {
            if (this._nextInterval == -1)
                return -1;
            return Math.max(0, this._nextInterval - (Time.now() - this.time));
        },

        requestFrame: function() {
            this.requestTimer(frameRateInterval);
        },

        requestImmediateFrame: function() {
            this.requestTimer(0);
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
        },

        set: function(id, value) {
            this._stateValues[id] = value;
        },

        get: function(id, value) {
            return this._stateValues[id];
        },

        remove: function(id) {
            delete this._stateValues[id];
        }
    });

    var AnimationController = function() {
        this._animations = [];
        this._state = new AnimationState();
        this._lastAnimationId = 0;
        this._nextTimerId = null;
        this._nextTimerInterval = -1;
        this._timerCallbak = this._onTimerFired.bind(this);
        this._inCompute = false;
        this._hasRemovedSet = false;
    };

    _.extend(AnimationController.prototype, Backbone.Events, {
        allocateAnimationId: function() {
            return ++this._lastAnimationId;
        },

        register: function(animationSet) {
            if (this._animations.indexOf(animationSet) != -1)
                return false;
            this._animations.push(animationSet);
            animationSet.on("change:animation", this._onAnimationPropertyChanged, this);
            this._onAnimationPropertyChanged();
            return true;
        },

        unregister: function(animationSet) {
            var index = this._animations.indexOf(animationSet);
            if (index == -1)
                return false;
            animationSet.off("change:animation", this._onAnimationPropertyChanged, this);
            if (this._inCompute) {
                this._animations[index] = null;
                this._hasRemovedSet = true;
            } else
                this._animations.splice(index, 1);
            this._onAnimationPropertyChanged();
            return true;
        },

        _setTimer: function(interval) {
            if (this._nextTimerInterval != -1 && 
                this._nextTimerInterval <= interval)
                return;
            // Remove any old timer and update it to throw in that amount.
            if (this._nextTimerId) {
                clearTimeout(this._nextTimerId);
                this._nextTimerId = null;
                this._nextTimerInterval = -1;
            }
            if (interval == -1)
                return;
            this._nextTimerInterval = interval;
            this._nextTimerId = setTimeout(this._timerCallbak, interval);
        },

        _onTimerFired: function() {
            this._nextTimerInterval = -1;
            this._nextTimerId = null;
            this.compute();
        },

        _onAnimationPropertyChanged: function() {
            if (this._pendingCommit)
                return;
            // Do not execute the compute now as we might hape incomplete
            // data structures at this point.
            // Just make sure that compute is going to be triggered soon.
            this._setTimer(0);
        },

        _cleanupSets: function() {
            this._animations = _.filter(this._animations, function(animation) {
                return !!animation;
            });
            this._hasRemovedSet = false;
        },

        compute: function() {
            this._pendingCommit = false;
            this._inCompute = true;
            var state = this._state;
            do {
                state.updateTime();
                _.each(this._animations, function(animationSet) {
                    if (animationSet)
                        animationSet.compute(state);
                });
            } while(!state.nextInterval());
            if (this._hasRemovedSet)
                this._cleanupSets();
            this._setTimer(state.nextInterval());
            this._inCompute = false;
        },

        runOnRequestAnimationFrame: function() {
            if (this._pendingCommit)
                return;
            this._pendingCommit = true;
            requestAnimationFrame.once("animation", this.compute, this).run();
            this._setTimer(-1);
        }
    });

    AnimationController.instance = new AnimationController();

    return AnimationController;

});