// 顶点着色器
varying vec2 vUv;
void main() {
  // 1. Three.js 自动提供了 attribute vec3 position 和 attribute vec2 uv
  
  // 2. 将 uv 坐标传递给 varying 变量，以便片元着色器使用
  vUv = uv; 

  // 3. 使用 position 计算最终的裁剪空间位置
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
