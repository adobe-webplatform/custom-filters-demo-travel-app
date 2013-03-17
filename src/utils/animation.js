define(["utils/animation_controller"], function(AnimationController) {

    var Animation = function(name) {
        this._id = AnimationController.instance.allocateAnimationId();
        this.name = name;
        this._animations = [];
    };

    _.extend(Animation.prototype, Backbone.Events, {
        compute: function(state, viewSate) {
            _.each(this._animations, function(animation) {
                animation.compute(state, viewSate);
            });
        },

        search: function(name) {
            return _.find(this._animations, function(animation) { return animation.name == name; });
        },

        get: function(name) {
            var result = this.search(name);
            if (!result) {
                result = new Animation(name);
                this.append(result);
            }
            return result;
        },

        append: function(animation) {
            animation.on("change:animation", this._onAnimationPropertyChange, this);
            this._animations.push(animation);
            this._onAnimationPropertyChange();
            return this;
        },

        insert: function(animation, i) {
            animation.on("change:animation", this._onAnimationPropertyChange, this);
            this._animations.splice(i, 0, animation);
            this._onAnimationPropertyChange();
            return this;
        },

        remove: function(animation) {
            var index = this._animations.indexOf(animation);
            if (index == -1)
                return;
            animation.off("change:animation", this._onAnimationPropertyChange, this);
            this._onAnimationPropertyChange();
            return this;
        },

        _onAnimationPropertyChange: function() {
            this.trigger("change:animation");
        }
    });

    return Animation;

});