/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function() {

    // Translated from C++ to JS.
    // http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/UnitBezier.h
    
    function cubicBezier(p1x, p1y, p2x, p2y) {
        // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
        var cx = 3.0 * p1x,
            bx = 3.0 * (p2x - p1x) - cx,
            ax = 1.0 - cx -bx;
             
        var cy = 3.0 * p1y,
            by = 3.0 * (p2y - p1y) - cy,
            ay = 1.0 - cy - by;
        
        function sampleCurveX(t)
        {
            // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
            return ((ax * t + bx) * t + cx) * t;
        }
        
        function sampleCurveY(t)
        {
            return ((ay * t + by) * t + cy) * t;
        }
        
        function sampleCurveDerivativeX(t)
        {
            return (3.0 * ax * t + 2.0 * bx) * t + cx;
        }
        
        // Given an x value, find a parametric value it came from.
        function solveCurveX(x, epsilon)
        {
            var t0, t1, t2, x2, d2, i;

            // First try a few iterations of Newton's method -- normally very fast.
            for (t2 = x, i = 0; i < 8; i++) {
                x2 = sampleCurveX(t2) - x;
                if (Math.abs(x2) < epsilon)
                    return t2;
                d2 = sampleCurveDerivativeX(t2);
                if (Math.abs(d2) < 1e-6)
                    break;
                t2 = t2 - x2 / d2;
            }

            // Fall back to the bisection method for reliability.
            t0 = 0.0;
            t1 = 1.0;
            t2 = x;

            if (t2 < t0)
                return t0;
            if (t2 > t1)
                return t1;

            while (t0 < t1) {
                x2 = sampleCurveX(t2);
                if (Math.abs(x2 - x) < epsilon)
                    return t2;
                if (x > x2)
                    t0 = t2;
                else
                    t1 = t2;
                t2 = (t1 - t0) * 0.5 + t0;
            }

            // Failure.
            return t2;
        }

        function solveEpsilon(duration)
        {
            return 1.0 / (200.0 * duration);
        }

        return function(x, duration)
        {
            return sampleCurveY(solveCurveX(x, solveEpsilon(duration)));
        };
    }

    return {
        cubicBezier: cubicBezier,
        ease: cubicBezier(0.25, 0.1, 0.25, 1),
        linear: cubicBezier(0, 0, 1, 1),
        easeIn: cubicBezier(0.42, 0, 1, 1),
        easeOut: cubicBezier(0, 0, 0.58, 1),
        easeInOut: cubicBezier(0.42, 0, 0.58, 1)
    };

});