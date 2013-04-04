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

precision mediump float;

// Built-in attributes.

attribute vec4 a_position;

// Built-in uniforms.

uniform mat4 u_projectionMatrix;

// Uniforms passed-in from CSS

uniform mat4 transform;

uniform float x;
uniform float y;
uniform float stretch;
uniform float touchSize;

// Constants

const float PI = 3.1415629;

// Main

void main()
{
    vec4 pos = a_position;

    float distanceToTouch = abs(pos.x + 0.5 - x);
    float cos = cos(clamp(PI * distanceToTouch * touchSize, 0.0, PI / 2.0));
    float touchFade = cos * max(0.0, touchSize - distanceToTouch) * min(0.5, (1.0 - y) * stretch);
    pos.y = (pos.y + 0.5) * max(0.0, y - touchFade * cos) - 0.5;

    gl_Position = u_projectionMatrix * transform * pos;
}
