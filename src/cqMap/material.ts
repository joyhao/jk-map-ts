import * as THREE from 'three';

export const defaultMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: '#4582F9',
    transparent: true,
    opacity: 0.2
  });
};

export const lineMaterial = () => {
  return new THREE.LineBasicMaterial({
    color: '#fff'
  });
};

export const hoverMaterial = () => {
  return new THREE.LineBasicMaterial({
    color: '#ffccff'
  });
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
      (p) => {},
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
