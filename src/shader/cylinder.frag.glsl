
varying vec2 vUv;

// 传入的摄像机世界坐标
uniform vec3 cameraPosition1;
// 传递到片元着色器的世界坐标
varying vec3 vWorldPosition;
// 传递到片元着色器的法线
varying vec3 vNormal;

// 颜色渐变
uniform vec3 color[4];
uniform float position[4];
uniform float time;
uniform int cLen;

#include "./lib/linear_gradient.frag.glsl";
#include "./lib/fresnel.frag.glsl";

void main(){
  // 1. 获取基础颜色
  vec3 cColor=linear();
  
  // 确保颜色值在有效范围内
  cColor=clamp(cColor,0.,1.);
  
  gl_FragColor=vec4(cColor,1);
}

