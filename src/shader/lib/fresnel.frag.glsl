// 原理

//在片元着色器中，计算视角方向（View Direction）和表面法线（Surface Normal）的点积（dot product）。
//点积的结果反映了观察角度：接近 1 表示正对表面，接近 0 表示掠射角。
//然后，使用菲涅耳公式或近似函数将此值转换为颜色或透明度。

// 菲涅耳计算函数（在片元着色器中）
float fresnel(vec3 normal,vec3 viewDir,float power,float bias,float scale){
  // 使用 abs() 确保法线和视线方向一致，以获得外发光效果
  float intensity=bias+scale*pow(1.-abs(dot(normal,viewDir)),power);
  return clamp(intensity,0.,1.);// 将强度限制在 0 到 1 之间
}

float fresnelEffect(){
  // --- 菲涅耳逻辑 (新增) ---
  
  // 1. 计算视角方向 (View Direction)
  // vWorldPosition：这是当前正在处理的顶点（或片段）在世界坐标系中的位置。在渲染过程中，这个值对于不同的顶点是不同的。
  // cameraPosition1：这是摄像机在世界坐标系中的位置，通常作为一个 uniform 变量传递给着色器。对于整个渲染过程（或至少当前帧），这个值是固定的。
  // cameraPosition1 - vWorldPosition：向量减法的结果是一个从起点 vWorldPosition 指向终点 cameraPosition1 的向量。这代表了从物体表面上的一点到眼睛（摄像机）的精确方向。
  // normalize(...)：normalize 函数将结果向量转换为单位向量（长度为 1 的向量），这对于光照计算（如漫反射和镜面反射）非常重要，因为它只需要方向信息，而不需要距离信息。
  vec3 viewDirection=normalize(cameraPosition1-vWorldPosition);
  
  // !!! 关键修复：根据渲染的面决定法线方向 !!!
  // 如果是背面，将法线反转，以确保光照和菲涅耳计算一致向外或一致向内
  vec3 adjustedNormal=normalize(vNormal);
  if(!gl_FrontFacing){
    adjustedNormal=-adjustedNormal;
  }
  
  // 2. 调用菲涅耳函数获取强度值
  // 调整这些参数以获得您想要的效果：
  // power: 控制边缘锐度 (值越大越锐利)
  // bias/scale: 控制发光范围和亮度
  float fresnelIntensity=fresnel(adjustedNormal,viewDirection,2.,.92,.9);
  
  return fresnelIntensity;
}