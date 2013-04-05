precision mediump float;

attribute vec4 a_position;
uniform mat4 u_projectionMatrix;

void main() {

    gl_Position = u_projectionMatrix * a_position;

}
