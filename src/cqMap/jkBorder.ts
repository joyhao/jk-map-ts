import * as THREE from 'three';
import type jkMap from './jkMap';
import type { City } from '@/data';
import { lineMaterial } from './material';
import { geoEach, getCenter } from './utils';
import { shiQu } from '@/data';
export default class jkBorder {
  map: jkMap;
  group = new THREE.Group();
  lineAni: {
    line: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    len: number;
  }[] = [];
  constructor(map: jkMap) {
    this.map = map;
    this.map.manGroup.add(this.group);
    this.init(shiQu);
    this.animation();
  }

  async init(shiQu: City) {
    const material = lineMaterial();
    const group = new THREE.Group();
    shiQu.features.forEach((item) => {
      const geometries = geoEach(item, this.drawShiQu.bind(this));
      if (geometries.length > 0) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(geometries, 3)
        );
        const mesh = new THREE.LineSegments(geometry, material);

        group.add(mesh);
        mesh.material.transparent = true;
        const positions = geometry.attributes.position.array as Float32Array;
        geometry.setDrawRange(0, 0);
        this.lineAni.push({
          line: mesh,
          len: positions.length / 3 //每个顶点有x,y,z 三个值
        });
      }
    });
    // 需要特别处理 居中， 不知道哪里位置出问题了
    const center = getCenter(this.map.manGroup);
    group.position.sub(center);
    this.group.add(group);
  }

  animation() {
    const line = this.lineAni[0];

    const ani = {
      drawCount: 0,
      factor: 0
    };

    this.map.gsap.to(ani, {
      factor: 1,
      drawCount: line.len,
      duration: 5,
      delay: 1,
      ease: 'linear',
      repeat: -1,
      onUpdate: () => {
        const count = Math.floor(line.len * ani.factor);
        line.line.geometry.setDrawRange(0, Math.floor(count));
      },
      onComplete: () => {
        line.line.material.opacity = 0;
      }
    });
  }

  /**
   *  画市边界
   * @param shapes
   * @returns
   */
  drawShiQu(shapes: number[][][]) {
    const geometries = this.map.drawLine(shapes);
    return geometries;
  }
}
