
varying vec2 vUv;
// 最大10种颜色
uniform vec3 color[4];
uniform float position[4];
uniform float time; 
uniform int cLen; 
void main() {
  // 使用 vUv.y 作为垂直渐变的位置 (0.0 to 1.0)
  float cPos = vUv.y;
  // 默认颜色
  vec3 cColor = color[0];

  // 循环遍历颜色停靠点，查找当前位置所属的区间
  for (int i = 0; i < cLen; i++){
    // 防止取值越界
    if ( i + 1 < cLen ) {
      vec3 startColor = color[i];
      vec3 endColor = color[ i + 1];
      float startPos = position[i];
      float endPos = position[i+1];

      if (cPos >= startPos && cPos <= endPos) {
        // 计算插值比例 t，并混合颜色
        float t = (cPos - startPos) / (endPos - startPos);
        cColor = mix(startColor, endColor, t);
        break; // 找到颜色后立即停止循环
      }
    }
  }

  

  gl_FragColor = vec4(cColor,1);
}
