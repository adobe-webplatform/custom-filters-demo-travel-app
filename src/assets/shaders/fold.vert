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

// Built-in attributes.

attribute vec4 a_position;
attribute vec3 a_triangleCoord;

// Built-in uniforms.

uniform mat4 u_projectionMatrix;
uniform vec2 u_meshSize;

// Uniforms passed-in from CSS
uniform float t;
uniform float light_intensity;
uniform float padding_height;
uniform float margin_height;
uniform float down_x;

// Varyings

varying float v_lighting;

// Constants

const float PI = 3.1415629;

// Main

float roundNum(float num) {
    return num > floor(num) + .5 ? ceil(num) : floor(num);
}

void main()
{
    vec4 pos = a_position;
    pos.x += .5;

    bool rightSide = (a_triangleCoord.z == 2.0 || a_triangleCoord.z == 3.0 || a_triangleCoord.z == 5.0);
    bool bottomSide = (a_triangleCoord.z == 3.0 || a_triangleCoord.z == 5.0 || a_triangleCoord.z == 6.0);

    // use the bottom segment as the shadow
    bool isShadow = a_triangleCoord.y == u_meshSize.y - 1.0;

    float col = a_triangleCoord.x + (rightSide ? 1.0 : 0.0);
    float lastFoldedCol = floor(roundNum(down_x * u_meshSize.x) / 2.0) * 2.0;
    bool isFoldedCol = col <= lastFoldedCol;

    // make the rest the columns behave like the last folded column at the right hand side for now.
    if(!isFoldedCol) pos.x = lastFoldedCol / u_meshSize.x;

    float foldedRatio = cos((lastFoldedCol - col) / lastFoldedCol * PI / 2.0 ) * t;

    if (isFoldedCol ) {
        pos.y = pos.y + mod(col, 2.0)  * padding_height * foldedRatio;
        pos.x = pos.x - (lastFoldedCol - col) / lastFoldedCol * t * ( 1.0 - foldedRatio) * .5;
        v_lighting = col == lastFoldedCol && !rightSide ? .5 : .5 + (mod(a_triangleCoord.x, 2.0) - .5) * foldedRatio * light_intensity;
    } else {
        v_lighting = .5;
    }

    if(isShadow) {
        if(bottomSide) {
            pos.x -=  col < lastFoldedCol ? (mod(col, 2.0)  * padding_height * foldedRatio) * .1 : .0;
            pos.y -=  margin_height + ( col < lastFoldedCol ? (mod(col, 2.0)  * padding_height * foldedRatio) * 2.0 : .0);
        } else {
            pos.y -= margin_height - padding_height;
        }
        v_lighting = .0;
        pos.z = 1.0;
    }

    // add offset back
    if(!isFoldedCol) pos.x += (col - lastFoldedCol) / u_meshSize.x; ;

    pos.z += a_position.z;
    pos.x += t / 2.0;

    pos.x -= .5;
    gl_Position = u_projectionMatrix * pos;

}
