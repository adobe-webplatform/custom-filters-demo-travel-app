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
uniform float oX;
uniform float oY;

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
    pos.y += sin(pos.y - a_position.y) * rangeRatio * sin(a_position.x * u_meshSize.x * PI / 2.0) * .05;

    v_lighting = .5 - sin(pos.y - a_position.y) * 1.0 - sin(pos.y - a_position.y) * diffX  * 20.0;

    gl_Position = u_projectionMatrix * transform * pos;

}
