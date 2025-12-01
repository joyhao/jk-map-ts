import * as THREE from 'three';
import type jkMap from './jkMap';
import { lj } from '@/data';
import { projectPos } from './utils';
import { lineDashedMaterial } from './material';
export default class jkPathAnimation {
  map: jkMap;
  group = new THREE.Group();
  animatedCube: THREE.Mesh<THREE.BoxGeometry> | undefined;
  entirePath: THREE.CurvePath<THREE.Vector3> = new THREE.CurvePath(); // 初始化 CurvePath
  constructor(map: jkMap) {
    this.map = map;
    this.map.manGroup.add(this.group);
    this.init();
    this.createAnimatedCube();
    this.animation();
  }
  init() {
    const material = lineDashedMaterial();
    for (let i = 0; i < lj.districts.length; i++) {
      const item = lj.districts[i];
      const next = lj.districts[i + 1];

      if (!next) break;
      const [x, y] = projectPos(item.coordinates);
      const [x1, y1] = projectPos(next.coordinates);
      const start = new THREE.Vector3(x, -y, 0.1);
      const end = new THREE.Vector3(x1, -y1, 0.1);
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5);
      const controlPoint = new THREE.Vector3(mid.x, mid.y, mid.z + 1);
      const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
      this.entirePath.add(curve); // 确保 entirePath 已定义后再调用 add
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const mesh = new THREE.Line(geometry, material);
      this.group.add(mesh);
    }
  }

  // 🌍 创建动画 cube
  createAnimatedCube() {
    // 使用简单的几何体和材质创建一个 cube
    const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05); // 调整大小以适应你的场景
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 绿色 cube
    this.animatedCube = new THREE.Mesh(geometry, material);
    this.group.add(this.animatedCube); // 将 cube 添加到 group 中

    // 将 cube 初始位置设置在路径起点
    if (this.entirePath) {
      const startPoint = this.entirePath.getPoint(0);
      if (startPoint) {
        this.animatedCube.position.copy(startPoint);
      }
    }
  }

  animation() {
    // 创建一个虚拟对象来存储进度值 (0到1)
    const animationData = {
      progress: 0
    };

    // 获取第一条曲线（如果需要多条曲线的连续动画，逻辑会更复杂）
    const path = this.entirePath;
    const cube = this.animatedCube;

    this.map.gsap.to(animationData, {
      progress: 1, // 目标值
      duration: 30, // 动画持续时间（秒）
      repeat: -1, // 无限重复
      onUpdate: () => {
        // 每一帧动画更新时调用的回调函数
        // 使用当前进度值获取曲面上的点
        const point = path.getPoint(animationData.progress);
        if (point) {
          // 更新 cube 的位置
          cube!.position.set(point.x, point.y, point.z);
        }
      }
    });
  }
}
