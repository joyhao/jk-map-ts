import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

export function exrLoader(path: string) {
  return new Promise((resolve) => {
    const loader = new EXRLoader();
    loader.load(
      path,
      (texture) => {
        resolve(texture);
      }, // 加载进度回调 (目前不支持)
      undefined,
      // 加载错误回调
      (error) => {
        console.error('加载纹理时出错', error);
      }
    );
  });
}

/**
 *环境贴图
 */
export async function createLight() {
  // const exr = '/assets/hdr/map.exr';
  // const texture = await exrLoader(exr);
  // // 使用 PMREMGenerator 优化环境贴图
  // const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
  // // 确保生成器只编译一次着色器
  // pmremGenerator.compileEquirectangularShader();
  // // 生成优化后的环境纹理（mipmaps, filtering etc）
  // const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  // // 1. 设置场景的整体环境光照和反射
  // this.scene.environment = envMap;
  // // 2. (可选) 设置为场景背景，如果你想直接看到这张图
  // // this.scene.background = envMap;
  // // 3. 清理不需要的资源
  // texture.dispose();
  // pmremGenerator.dispose();
}
