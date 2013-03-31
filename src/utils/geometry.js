define(function() {

    var Geometry = {
        dist: function(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        },

        angle: function(x1, y1, x2, y2) {
            var cos = (x1 * x2 + y1 * y2) / (dist(0, 0, x1, y1) * dist(0, 0, x2, y2));
            return Math.acos(cos) * 180 / Math.PI;
        },

        rotation: function(x1, y1, x2, y2) {
            var angle1 = Geometry.angle(1, 0, x1, y1);
            var angle2 = Geometry.angle(1, 0, x2, y2);
            if (y1 > 0)
                angle1 = - angle1;
            if (y2 > 0)
                angle2 = - angle2;
            return angle1 - angle2;
        }
    };

    return Geometry;

});