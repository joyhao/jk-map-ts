import * as THREE from 'three';
import type jkMap from './jkMap';
import { renKou } from '@/data';
import { cylinderMaterial } from './material';
import { projectPos } from './utils';

export default class jkCylinder {
  map: jkMap;
  group = new THREE.Group();
  constructor(map: jkMap) {
    this.map = map;
    this.map.manGroup.add(this.group);
    this.init();
    this.animation();
  }

  init() {
    const total = renKou.total;
    renKou.districts.forEach((item) => {
      const percent = (item.population / total) * 5;
      const geometry = new THREE.CylinderGeometry(0.05, 0.05, percent, 32);
      const mesh = new THREE.Mesh(geometry, cylinderMaterial());
      const [x, y] = projectPos(item.coordinates);
      mesh.position.set(x, -y, 0.01);
      mesh.rotateX(Math.PI / 2);
      geometry.translate(0, percent / 2, 0);
      mesh.scale.y = 0;
      this.group.add(mesh);
    });
  }

  animation() {
    this.group.children.forEach((mesh, i) => {
      this.map.gsap.to(mesh.scale, {
        y: 1,
        duration: 1.5,
        delay: i * 0.1
      });
    });
  }
}
