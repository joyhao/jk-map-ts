// 顶点着色器
varying vec2 vUv;
varying vec3 vWorldPosition;// 传递到片元着色器的世界坐标
varying vec3 vNormal;// 声明一个 varying 变量，用于传递给片元着色器
void main(){
  // 1. Three.js 自动提供了 attribute vec3 position 和 attribute vec2 uv
  // 2. 将 uv 坐标传递给 varying 变量，以便片元着色器使用
  vUv=uv;
  
  // three.js 内置属性:
  // attribute vec3 normal; // three.js 自动提供 normal 属性
  // uniform mat3 normalMatrix; // three.js 自动提供 normalMatrix uniform
  
  // 将法向量从模型空间转换到视图空间
  vNormal=normalize(normalMatrix*normal);
  
  // 将顶点位置从局部坐标转换为世界坐标
  vWorldPosition=(modelMatrix*vec4(position,1.)).xyz;
  
  // 3. 使用 position 计算最终的裁剪空间位置
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
