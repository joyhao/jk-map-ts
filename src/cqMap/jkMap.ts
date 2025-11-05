import * as THREE from 'three';
import jkCore from './jkCore';

import { getQuXian, type QuXian } from '@/data';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { defaultMaterial, lineMaterial } from './material';
import { getCenter, toRad, projectPos, geoEach } from './utils';
import type { UserData } from './cq.interface';

export default class jkMap extends jkCore {
  quXian = getQuXian();
  manGroup: THREE.Group = new THREE.Group();

  constructor(selector: string) {
    super(selector);
    this.sceneAdd(this.manGroup);
    this.initGeo();
  }

  initGeo() {
    this.createShiQu(this.quXian);
    this.createShiQuLine(this.quXian);

    this.manGroup.rotateX(toRad(270));
    // 居中 getCenter 获取集合体中点点
    const center = getCenter(this.manGroup);
    this.manGroup.position.sub(center);
    this.manGroup.position.y = 0.1;
  }

  /**
   * 画区县形状
   * @param shapes
   * @returns
   */
  drawQuXian(shapes: number[][][]) {
    const shapeList: THREE.ExtrudeGeometry[] = [];
    const shape = new THREE.Shape();
    shapes.forEach((item) => {
      let firstPoint = true;
      for (let i = 0; i < item.length; i++) {
        const coord = item[i];
        // @ts-ignore
        const [x, y] = projectPos(coord);
        if (isNaN(x) || isNaN(y)) continue;
        if (firstPoint) {
          shape.moveTo(x, -y);
          firstPoint = false;
        } else {
          shape.lineTo(x, -y);
        }
      }

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.1,
        bevelEnabled: false
      });
      shapeList.push(geometry);
    });

    return shapeList;
  }

  /**
   * 创建区县地图
   */
  createShiQu(quXian: QuXian) {
    quXian.features.forEach((item) => {
      const name = item.properties.name;
      const geometries = geoEach(item, this.drawQuXian);
      if (geometries.length > 0) {
        const mergeGeometry = mergeGeometries(geometries);
        const mesh = new THREE.Mesh(mergeGeometry, defaultMaterial());
        const userName: UserData = {
          name: name,
          type: '区',
          hasHover: true
        };
        mesh.userData = userName;
        this.manGroup.add(mesh);
        geometries.forEach((geo) => geo.dispose()); // 清理临时几何体
      }
    });
  }

  /**
   * 画区县边界
   * @param shapes
   * @returns
   */
  drawLine(shapes: number[][][]) {
    const shapeList: number[] = [];
    shapes.forEach((item) => {
      for (let i = 0; i < item.length - 1; i++) {
        const [x1, y1] = projectPos(item[i]);
        const [x2, y2] = projectPos(item[i + 1]);

        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) continue;

        shapeList.push(x1, -y1, 0.1);
        shapeList.push(x2, -y2, 0.1);
      }
    });

    return shapeList;
  }

  /**
   * 创建区县的边界线
   * @param quXian
   */
  createShiQuLine(quXian: QuXian) {
    quXian.features.forEach((item) => {
      const geometries = geoEach(item, this.drawLine);

      if (geometries.length > 0) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(geometries, 3)
        );
        const line = new THREE.LineSegments(geometry, lineMaterial());
        this.manGroup.add(line);
      }
    });
  }
}
