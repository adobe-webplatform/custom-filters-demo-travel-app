precision mediump float;

// Built-in attributes.

attribute vec4 a_position;
attribute vec3 a_triangleCoord;

// Built-in uniforms.

uniform mat4 u_projectionMatrix;
uniform vec2 u_meshSize;

// Uniforms passed-in from CSS

uniform mat4 transform;
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

void main()
{
    vec4 pos = a_position;

    bool rightSide = (a_triangleCoord.z == 2.0 || a_triangleCoord.z == 3.0 || a_triangleCoord.z == 5.0);
    bool bottomSide = (a_triangleCoord.z == 3.0 || a_triangleCoord.z == 5.0 || a_triangleCoord.z == 6.0);
    bool isShadow = u_meshSize.y - a_triangleCoord.y  <= 1.0;

    float coord = a_triangleCoord.x + (rightSide ? 1.0 : 0.0);
    float down_col = down_x * u_meshSize.x;
    float ratio = cos((down_col - coord) / down_col * PI / 2.0 ) * t;

    if (coord < down_col ) {
        pos.y = pos.y + mod(coord, 2.0)  * padding_height * ratio;
        pos.x = pos.x - (down_col - coord) / down_col * t * ( 1.0 - ratio) * .5;
        v_lighting = .5 + (mod(a_triangleCoord.x, 2.0) - .5) * ratio * light_intensity;
    } else {
        pos.x = pos.x + t * (1.0 - down_x) * .3;
        v_lighting = .5;
    }
    if(isShadow) {
        if(bottomSide) {
            pos.x -=  coord < down_col ? (mod(coord, 2.0)  * padding_height * ratio) * .1 : .0;
            pos.y -=  margin_height + ( coord < down_col ? (mod(coord, 2.0)  * padding_height * ratio) * 2.0 : .0);
        } else {
            pos.y -= margin_height - padding_height;
        }
        v_lighting = .0;
        pos.z = 1.0;
    }

    pos.z += a_position.z;

    gl_Position = u_projectionMatrix * transform * pos;

}
