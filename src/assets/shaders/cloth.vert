/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Adobe System Incorporated
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
precision mediump float;

attribute vec4 a_position;

uniform mat4 u_projectionMatrix;

//uniform mat4 transform;
uniform float downX;
uniform float downY;
uniform float toX;
uniform float toY;
uniform float oX;
uniform float oY;
uniform float translateY;

varying float v_lighting;

const float PI = 3.1415629;

void main() {
    vec4 pos = a_position;
    float x = pos.x + .5;
    float y = pos.y + .5;

    float diffX = toX - x;
    float downOffsetY = toY - downY;
    float distanceDownTo = distance(toX - downX, toY - downY);
    float rangeRatio = (cos( clamp( diffX * (10.0 + 9.0 *  downOffsetY), -PI, PI ) ) + 1.0 ) / 2.0;
    float yRatio = sin(max(a_position.y - downY + .5, .0));

    pos.y = pos.y + max(0.0, y - downY) * rangeRatio * .5 + min(0.0, toY - y) * rangeRatio;
    pos.y = pos.y + (oY - toY) * rangeRatio * yRatio;
    pos.x = pos.x + (oX - toX) * abs(cos(diffX)) * yRatio;

    v_lighting = .5 - sin(pos.y - a_position.y) * 1.0 - sin(pos.y - a_position.y) * diffX  * 20.0;

    pos.y += translateY;
    gl_Position = u_projectionMatrix * pos;

}
