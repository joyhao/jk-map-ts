varying vec2 vUv;
uniform vec3 color[3];      // 假设最多10个颜色
uniform float position[3]; // 假设最多10个边界位置
uniform int cLen;

void main() {
    // 使用 vUv.y 作为垂直位置 (0.0 到底部, 1.0 到顶部)
    float yPos = vUv.y; 
    vec3 finalColor;

    // 循环遍历颜色段
    for (int i = 0; i < cLen; i++) {
        float boundary = position[i];
        // 如果当前像素位置在当前边界之下，就使用当前颜色
        if (yPos < boundary) {
          finalColor = color[i];
          break; // 找到颜色后立即停止循环
        }
    }

 

    gl_FragColor = vec4(finalColor, 1.0);
}
