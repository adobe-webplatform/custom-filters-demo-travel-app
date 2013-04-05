precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;
attribute vec3 a_triangleCoord;

uniform mat4 u_projectionMatrix;
uniform vec2 u_meshSize;

uniform mat4 transform;
uniform float downX;
uniform float downY;
uniform float toX;
uniform float toY;

varying float v_lighting;

const float PI = 3.1415629;

void main() {
    vec4 pos = a_position;
    float x = pos.x + .5;
    float y = pos.y + .5;

    float diffX = toX - x;
    float distanceDownTo = distance(toX - downX, toY - downY);


    float offsetY = (cos( clamp( diffX * 10.0, -PI, PI ) ) + 1.0 ) / 2.0;

    pos.y = pos.y + max(0.0, y - downY) * offsetY * .5 + min(0.0, toY - y) * offsetY;





    v_lighting = .5;

    gl_Position = u_projectionMatrix * transform * pos;

}
