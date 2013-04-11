precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;
attribute vec3 a_triangleCoord;

uniform mat4 u_projectionMatrix;
uniform vec2 u_meshSize;

uniform float t;
uniform float threshold;
uniform float bounce;
uniform float isVertical;

varying float v_lighting;

const float PI = 3.1415629;

void main() {
    vec4 pos = a_position;
    float oriP0 = isVertical > .5 ? pos.y : pos.x;
    float oriP1 = isVertical > .5 ? pos.x : pos.y;
    float p0 = isVertical > .5 ? pos.y : pos.x;
    float p1 = isVertical > .5 ? pos.x : pos.y;
    float coord = isVertical > .5 ? a_triangleCoord.y : a_triangleCoord.x;
    float direction = coord >= (isVertical > .5 ? u_meshSize.y : u_meshSize.x) * .5 ? 1.0 : -1.0;
    float forceRange = max(0.0, cos(p0 * PI * 5.0)) * cos(p1 * PI) * t;
    float force0 = cos(p1 * PI) * direction * forceRange * .15 + sin((p1 + .5) * PI * 2.0) * forceRange * .01;
    float force1 = (1.0 + cos((p0 *direction* 2.0 + .25) * PI)) * p1 * forceRange * .2;
    p0 = p0 + t * direction;

    if(t < threshold) {
        force0 = (oriP0 - p0) + t * sin(oriP0 * PI * 2.0) * .3;
        force1 = -force1;
        v_lighting = .5;
    } else {
        p0 -= direction *.05 - direction * bounce * force0;
        v_lighting = .5 - force0 * 2.5 - force1 * 2.5;
    }

    if(isVertical > .5) {
        pos.x = p1 +force1;
        pos.y = p0 + force0;
    } else {
        pos.x = p0 + force0;
        pos.y = p1 + force1;
    }
    pos.z = abs(force0) + abs(force1);


    gl_Position = u_projectionMatrix * pos;

}
