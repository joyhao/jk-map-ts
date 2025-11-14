import * as THREE from 'three';
import type jkMap from './jkMap';
import { renKou } from '@/data';
import { cylinderMaterial, linear } from './material';
// @ts-ignore
import vertexShader from '@/shader/cylinder.vert.glsl';
// @ts-ignore
import fragmentShader from '@/shader/cylinder.frag.glsl';

import { gslUpdateTime, projectPos, uvCalc } from './utils';
import type { UserData } from './cq.interface';

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
    const color = linear();
    const material = cylinderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color.map((stop) => stop.color) },
        position: { value: color.map((stop) => stop.position) },
        cLen: { value: color.length }
      },
      vertexShader,
      fragmentShader
      // transparent: true
    });

    renKou.districts.forEach((item) => {
      const percent = (item.population / total) * 5;
      const geometry = uvCalc(
        new THREE.CylinderGeometry(0.05, 0.05, percent, 32)
      );

      const mesh = new THREE.Mesh(geometry, material);
      const [x, y] = projectPos(item.coordinates);

      const userData: UserData = {
        name: item.district,
        type: '柱状图',
        hasHover: false,
        shaderMaterial: material
      };
      mesh.userData = userData;
      mesh.position.set(x, -y, 0.01);
      mesh.rotateX(Math.PI / 2);
      geometry.translate(0, percent / 2, 0);
      mesh.scale.y = 0;
      this.group.add(mesh);
    });
  }

  animation() {
    const ticket = this.map.ticket();

    ticket.start((time) => {
      gslUpdateTime(time, this.group);
    });

    this.group.children.forEach((mesh, i) => {
      this.map.gsap.to(mesh.scale, {
        y: 1,
        duration: 1.5,
        delay: i * 0.1
      });
    });
  }
}
