import * as THREE from 'three';
import type jkMap from './jkMap';
import { renKouQXi } from '@/data';
import { projectPos } from './utils';
import { hoverMaterial } from './material';
export default class jkLine {
  map: jkMap;
  group = new THREE.Group();
  lineAni: {
    line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    len: number;
  }[] = [];
  constructor(map: jkMap) {
    this.map = map;
    this.map.manGroup.add(this.group);
    this.init();
    this.animation();
  }
  init() {
    renKouQXi.districts.forEach((item) => {
      const [x, y] = projectPos(item.coordinates);
      const start = new THREE.Vector3(x, -y, 0.1);
      // item 起点
      item.city.forEach((city) => {
        // city 终点
        const [x1, y1] = projectPos(city.coordinates);
        const end = new THREE.Vector3(x1, -y1, 0.1);
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);
        const controlPoint = new THREE.Vector3(mid.x, mid.y, mid.z + 2);
        const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const mesh = new THREE.Line(geometry, hoverMaterial());
        geometry.setDrawRange(0, 0);
        this.group.add(mesh);
        this.lineAni.push({
          line: mesh,
          len: points.length
        });
      });
    });
  }
  animation() {
    for (let i = 0; i < this.lineAni.length; i++) {
      const line = this.lineAni[i];
      const ani = {
        drawCount: 0
      };
      this.map.gsap.to(ani, {
        drawCount: line.len,
        duration: 2 + i * 0.5, // 2000 + i * 500 毫秒，换算成秒
        delay: i * 0.5, // i * 500 毫秒，换算成秒
        onUpdate: () => {
          line.line.geometry.setDrawRange(0, Math.floor(ani.drawCount));
        }
      });
    }
  }
}
