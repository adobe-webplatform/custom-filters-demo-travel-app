precision mediump float;

varying float v_lighting;

void main() {
    css_MixColor = vec4(v_lighting, v_lighting, v_lighting, 1.0);
}
