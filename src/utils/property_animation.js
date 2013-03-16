define(["utils/basic_animation"], function(BasicAnimation) {
    
    var PropertyAnimation = function(name) {
        BasicAnimation.call(this, name);
    };

    _.extend(PropertyAnimation, BasicAnimation.prototype, {
        
    });

});