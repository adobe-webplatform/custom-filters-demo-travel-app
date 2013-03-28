define(function() {

    function BaseEffect() { }
    _.extend(BaseEffect.prototype, {
        isSupported: function() {
            return false;
        },
        
        onDragStart: function(containerView, filterView, nextCard) {
            return 0;
        },

        onDragMove: function(containerView, filterView, nextCard, transform, dragStartValue) {
            return 0;
        },

        shouldRevert: function(containerView, value, direction) {
            return false;
        },

        commit: function(containerView, filterView, nextCard) {
            return null;
        },

        revert: function(containerView, filterView, nextCard) {
            return null;
        },

        cleanup: function(containerView, filterView, nextCard) {
        }
    });

    return BaseEffect;

});
