varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec3 color1;
uniform vec3 color2;
uniform float time; 

void main() {
  // 从纹理中采样颜色
  vec4 textureColor = texture2D(uTexture, vUv);
  float gradientFactor = (sin(time) + 1.0) / 2.0;
  vec3 gradientColor = mix(color1, color2, vUv.x + sin(time) * 0.5);
  // 将纹理颜色和渐变色相乘叠加
  gl_FragColor = vec4(textureColor.rgb * gradientColor , textureColor.a);
}


