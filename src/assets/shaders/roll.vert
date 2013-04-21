precision mediump float;

attribute vec4 a_position;
attribute vec3 a_triangleCoord;

uniform mat4 u_projectionMatrix;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;

uniform mat4 transform;

uniform float t;

varying float light;

const float PI = 3.1415629;

float circOut(float t) {
    return (t - 1.0) * (t - 1.0) * (t - 1.0) + 1.0;
}

void main() {
    vec4 pos = a_position;
    light = .5;

    bool leftSide = (a_triangleCoord.z == 1.0 || a_triangleCoord.z == 4.0 || a_triangleCoord.z == 6.0);
    bool bottomSide = (a_triangleCoord.z == 3.0 || a_triangleCoord.z == 5.0 || a_triangleCoord.z == 6.0);

    float maxSteps = u_meshSize.x + u_meshSize.y - 1.0;
    float currentStep = floor( t * maxSteps );
    float currentStepRatio = circOut(t * maxSteps - currentStep);
    // roll left
    float step = a_triangleCoord.y == 0.0 ? ( u_meshSize.x - 1.0)  -  a_triangleCoord.x : a_triangleCoord.y + ( u_meshSize.x - 1.0);
    if(step == currentStep) {
        if( a_triangleCoord.y == 0.0 && leftSide) {
            pos.x += cos( currentStepRatio * PI / 2.0) * 2.0 / u_meshSize.x;
            pos.z -= sin( currentStepRatio * PI) / u_meshSize.x * u_textureSize.x;
        } else if( a_triangleCoord.y > 0.0 && bottomSide) {
            pos.y -= cos( currentStepRatio * PI / 2.0) * 2.0 / u_meshSize.y;
            pos.z -= sin( currentStepRatio * PI) / u_meshSize.y * u_textureSize.y;
        }
        light = .5 - cos(currentStepRatio * PI / 2.0) * .5;
    }

    if(step > currentStep || (step == currentStep && currentStepRatio < .5)) {
        pos.x = - 2.0;
        pos.y = - 2.0;
        pos.z = 1000.0;
    }

    gl_Position = u_projectionMatrix * transform * pos;

}
