
vec3 linear(){
  // 使用 vUv.y 作为垂直渐变的位置 (0.0 to 1.0)
  // 它将 time * 0.5 的结果限制在 0.0 到 1.0 的范围内。
  float timeOffset=mod(time*.5,1.);// 0.5 是速度因子，可以调整
  // 这确保了当 vUv.y + timeOffset 超过 1.0 时，它会“绕回”到 0.0，形成一个永不停止的垂直循环渐变动画。
  float cPos=mod(vUv.y+timeOffset,1.);// 将偏移应用到 vUv.y 上
  // 默认颜色
  vec3 cColor=color[0];
  
  // 循环遍历颜色停靠点，查找当前位置所属的区间
  for(int i=0;i<cLen;i++){
    // 防止取值越界
    if(i+1<cLen){
      vec3 startColor=color[i];
      vec3 endColor=color[i+1];
      float startPos=position[i];
      float endPos=position[i+1];
      
      if(cPos>=startPos&&cPos<=endPos){
        // 计算插值比例 t，并混合颜色
        float t=(cPos-startPos)/(endPos-startPos);
        // 1.0 可实现不渐变效果
        cColor=mix(startColor,endColor,t);
        break;// 找到颜色后立即停止循环
      }
    }
  }
  
  return cColor;
}
