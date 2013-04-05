define(function(){

    return window.getComputedStyle ? function(elem) {
        return window.getComputedStyle(elem, "null");
    } : function(elem) {
        return {
            getPropertyValue : function(prop) {
                var style;
                if(prop == 'float') {
                    style = 'styleFloat';
                } else {
                    style = prop.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
                }
                return elem.currentStyle[style] ? elem.currentStyle[style] : null;
            }
        };
    };

});