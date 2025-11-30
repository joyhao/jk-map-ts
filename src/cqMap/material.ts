import * as THREE from 'three';

export const defaultMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: '#4582F9',
    transparent: true,
    opacity: 0.2
  });
};

export const waterMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: 'rgb(255,124,125)',
    transparent: true,
    opacity: 1
  });
};

export const lineMaterial = () => {
  return new THREE.LineBasicMaterial({
    color: '#fff'
  });
};

export const lineDashedMaterial = () => {
  return new THREE.LineDashedMaterial({
    color: 0x00ffff, // Example color, adjust as needed
    dashSize: 3, // Size of the visible part of the line
    gapSize: 3, // Size of the gap
    transparent: true,
    opacity: 0.8
  });
};

export const hoverMaterial = () => {
  return new THREE.LineBasicMaterial({
    color: '#ffccff'
  });
};

export const linear = () => {
  return [
    { color: new THREE.Color(1, 0, 0), position: 0.2 }, // 红
    { color: new THREE.Color(0, 1, 0), position: 0.5 }, // 绿
    { color: new THREE.Color(0, 0, 1), position: 0.8 }, // 蓝
    { color: new THREE.Color(1, 0, 1), position: 1.0 }
  ];
};

export const cylinderMaterial = (
  parameters: THREE.ShaderMaterialParameters
) => {
  return new THREE.ShaderMaterial(parameters);
};

// 加载图片

export function loadImage(url: string) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (texture) => {
        // const material = new THREE.MeshStandardMaterial({
        //   map: texture,
        //   transparent: true
        // });
        resolve(texture);
      },
      () => {},
      (err) => {
        reject(null);
        console.error('加载纹理时发生错误:', err);
      }
    );
  });
}

/**
 * 加载纹理
 * @returns
 */
export async function loadTexture(url: string) {
  // 异步加载名为cqMap的图像，该图像将用作纹理。
  const texture = await loadImage(url);
  return texture;
}
