import * as THREE from 'three';
import jkCore from './jkCore';

import { quXian, type City } from '@/data';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  defaultMaterial,
  hoverMaterial,
  lineMaterial,
  loadTexture
} from './material';
import cqMap from '@/image/cq.png';
import { getCenter, toRad, projectPos, geoEach, uvCalc } from './utils';
import type { UserData } from './cq.interface';

// @ts-ignore
import mapVertexShader from '@/shader/mapVertexShader.vert';
// @ts-ignore
import mapFragmentShader from '@/shader/mapFragmentShader.frag';
import jkLabel from './jkLabel';
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default class jkMap extends jkCore {
  manGroup: THREE.Group = new THREE.Group();
  labelHandle: jkLabel;
  labelRenderer: CSS2DRenderer;
  constructor(selector: string) {
    super(selector);
    this.labelHandle = new jkLabel(this);
    this.labelRenderer = this.labelHandle.initLabelRenderer(selector);
    this.sceneAdd(this.manGroup);
    this.initGeo();
    this.animation();
  }

  initGeo() {
    this.createQuXian(quXian);
    this.createShiQuLine(quXian);

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
   * 画区县边界线
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

        shapeList.push(x1, -y1, 0.01);
        shapeList.push(x2, -y2, 0.01);
      }
    });

    return shapeList;
  }

  /**
   * 创建区县地图
   */
  async createQuXian(quXian: City) {
    let geoList: THREE.BufferGeometry[] = [];
    quXian.features.forEach((item) => {
      const name = item.properties.name;
      const geometries = geoEach(
        item,
        this.drawQuXian
      ) as THREE.ExtrudeGeometry[];
      if (geometries.length > 0) {
        const mergeGeometry = mergeGeometries(geometries);
        geoList.push(mergeGeometry);
        const mesh = new THREE.Mesh(mergeGeometry, defaultMaterial());
        const userData: UserData = {
          name: name,
          type: '区',
          hasHover: true
        };
        mesh.userData = userData;
        const label = this.labelHandle.createLabel(mesh);
        mesh.add(label);
        this.manGroup.add(mesh);
        geometries.forEach((geo) => geo.dispose()); // 清理临时几何体
      }
    });

    this.createDiTu(geoList);
  }

  /**
   * 创建纹理底图
   * @param geoList
   */
  async createDiTu(geoList: THREE.BufferGeometry[]) {
    const texture = await loadTexture(cqMap);
    const mergeGeometry = uvCalc(mergeGeometries(geoList));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uTexture: { value: texture },
        color1: { value: new THREE.Color(1, 0, 0) },
        color2: { value: new THREE.Color(0, 0, 1) }
      },
      vertexShader: mapVertexShader,
      fragmentShader: mapFragmentShader
    });

    const mesh = new THREE.Mesh(mergeGeometry, material);
    mesh.userData.shaderMaterial = material;
    mesh.position.z = -0.1;
    this.manGroup.add(mesh);
    geoList.forEach((geo) => geo.dispose()); // 清理临时几何体
  }

  /**
   * 创建区县的边界线
   * @param quXian
   */
  createShiQuLine(quXian: City) {
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

  /**
   * 地图高亮
   */
  createHighLight() {
    let hover: THREE.Object3D | null = null;
    const mesh = this.manGroup.children.filter(
      (child) => (child as THREE.Mesh) && child.userData.hasHover
    );

    const start = () => {
      const intersects = this.handleIntersects(mesh);
      if (intersects.length >= 1) {
        const intersect = intersects[0].object;
        if (intersect !== hover) {
          if (hover) {
            //@ts-ignore
            hover.material.color.set(defaultMaterial().color);
          }
          hover = intersect;
          //@ts-ignore
          hover.material.color.set(hoverMaterial().color);
        }
      } else {
        if (hover) {
          //@ts-ignore
          hover.material.color.set(defaultMaterial().color);
          hover = null;
        }
      }
    };

    return {
      start
    };
  }

  /**
   * 创建时间函数
   */
  animation() {
    const ticket = this.ticket();
    const hLight = this.createHighLight();
    ticket.start(() => {
      if (this.labelRenderer) {
        this.labelRenderer.render(this.scene, this.camera);
      }
      hLight.start();
    });
  }
}
