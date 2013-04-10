precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;
attribute vec3 a_triangleCoord;

uniform mat4 u_projectionMatrix;
uniform vec2 u_meshSize;

uniform float distance;
uniform float lightIntensity;
uniform float padding;
uniform float margin;
uniform float down_x;
uniform bool isVertical;

varying float v_lighting;

const float PI = 3.1415629;

void main() {
    vec4 pos = a_position;
    float oriP0 = isVertical ? pos.y : pos.x;
    float oriP1 = isVertical ? pos.x : pos.y;
    float p0 = isVertical ? pos.y : pos.x;
    float p1 = isVertical ? pos.x : pos.y;
    float coord = isVertical ? a_triangleCoord.y : a_triangleCoord.x;
    float direction = coord >= (isVertical ? u_meshSize.y : u_meshSize.x) * .5 ? 1.0 : -1.0;
    float forceRange = max(0.0, cos(p0 * PI * 5.0)) * distance;
    float force0 = cos(p1 * PI) * direction * forceRange * .15 + sin((p1 + .5) * PI * 2.0) * forceRange * .01;
    float force1 = (1.0 + cos((p0 *direction* 2.0 + .25) * PI)) * p1 * forceRange * .2;
    p0 = p0 + distance * direction / 2.0;

    if(distance < .15) {
        force0 = (oriP0 - p0) + distance * sin(oriP0 * PI * 2.0) * .2;
        force1 = -force1;
        v_lighting = .5;
    } else {
        p0 -= direction *.05;
        v_lighting = .5 - force0 * 3.5 - force1 * 3.5;
    }

    if(isVertical) {
        pos.x = p1 +force1;
        pos.y = p0 + force0;
    } else {
        pos.x = p0 + force0;
        pos.y = p1 + force1;
    }
    pos.z = abs(force0) + abs(force1);


    gl_Position = u_projectionMatrix * pos;

}
