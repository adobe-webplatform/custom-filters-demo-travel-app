define(function() {
    var BasicAnimation = function(name) {
        this.name = name;
    };

    _.extend(BasicAnimation, Backbone.Events, {
        applyValues: function(view, state) {

        },

        compute: function(state) {

        }
    });
});