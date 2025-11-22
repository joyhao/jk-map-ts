import * as THREE from 'three';
import type jkMap from './jkMap';
import { renKouJj } from '@/data';
import { projectPos } from './utils';
import { waterMaterial } from './material';
export default class jkWater {
  map: jkMap;
  group = new THREE.Group();
  constructor(map: jkMap) {
    this.map = map;
    this.map.manGroup.add(this.group);
    this.init();
    this.animation();
  }

  createMesh(item: any, inner: number, outer: number) {
    const [x, y] = projectPos(item.coordinates);
    const geometry = new THREE.RingGeometry(inner, outer);
    const mesh = new THREE.Mesh(geometry, waterMaterial());
    mesh.position.set(x, -y, 0.11);
    mesh.scale.set(0.0, 0.0, 0.0);
    mesh.material.opacity = 1;
    return mesh;
  }

  init() {
    renKouJj.districts.forEach((item) => {
      const obj = new THREE.Object3D();
      const mesh = this.createMesh(item, 0.3, 0.5);
      const mesh1 = this.createMesh(item, 0.3, 0.5);
      const mesh2 = this.createMesh(item, 0.3, 0.5);
      obj.add(mesh, mesh1, mesh2);
      this.group.add(obj);
    });
  }
  animation() {
    this.group.children.forEach((obj, index) => {
      const baseDelay = index * 0.5;
      for (let i = 0; i < obj.children.length; i++) {
        const child = obj.children[i] as THREE.Mesh;
        const ringDelay = i * 1; // 环形延迟，转换为秒

        // 初始状态已经在 createMesh 中设置，GSAP 会从当前状态开始动画
        // 我们可以直接对 mesh 的属性进行动画，无需中间变量 p
        if (child.material) {
          this.map.gsap.to(child.material, {
            opacity: 0,
            duration: 3, // 动画持续时间（3000ms）
            delay: baseDelay + ringDelay,
            repeat: -1, // 无限次重复
            ease: 'none' // 根据需求选择合适的缓动函数
          });
        }

        this.map.gsap.to(child.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 3,
          delay: baseDelay + ringDelay,
          repeat: -1,
          ease: 'none' // 根据需求选择合适的缓动函数
        });
      }
    });
  }
}
