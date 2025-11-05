import * as THREE from 'three';
import type { StartFun } from '@/cqMap/cq.interface';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class jkCore {
  container: HTMLElement;
  bound: DOMRect;
  left: number;
  top: number;
  width: number;
  height: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  control!: OrbitControls;

  constructor(selector: string) {
    // 容器相关
    this.container = document.querySelector(selector) as HTMLElement;
    this.bound = this.container.getBoundingClientRect();
    this.left = this.bound.left;
    this.top = this.bound.top;
    this.width = this.bound.width;
    this.height = this.bound.height;

    // three 相关
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    //  渲染器设置
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    // 相机设置
    this.camera.position.set(0, 5, 8.5);
    this.camera.lookAt(0, 0, 0);

    window.addEventListener('resize', this.resizeHandle.bind(this));

    this.createGrid();
    this.createAxes();
    this.createControls();
    this.createLight();
    this.animate();
  }

  /**
   * 创建网格辅助器
   */
  createGrid() {
    const size = Math.max(this.width, this.height) / 100;
    const grid = new THREE.GridHelper(size * 2, size);
    this.sceneAdd(grid);
  }

  /**
   * 坐标轴辅助器
   */
  createAxes() {
    const axes = new THREE.AxesHelper(5);
    this.sceneAdd(axes);
  }

  /**
   * 添加鼠标辅助器
   */
  createControls() {
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.enableDamping = true;
    this.control.dampingFactor = 0.25;
  }

  /**
   * 添加光源
   */
  async createLight() {
    const color = new THREE.Color('rgb(255, 255, 255)');
    // 环境光
    const ambient = new THREE.AmbientLight(color, 10);
    this.sceneAdd(ambient);
    // 方向光
    const directional = new THREE.DirectionalLight(color, 2);
    directional.position.set(5, 5, 5);
    this.sceneAdd(directional);
    // 辅助光
    const directional2 = new THREE.DirectionalLight(color, 1);
    directional2.position.set(-5, 5, -5);
    this.sceneAdd(directional2);
  }

  /**
   * 添加到场景
   * @param cube
   */
  sceneAdd(cube: THREE.Object3D) {
    this.scene.add(cube);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.control.update();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 外部使用
   * @param {*} fn
   */
  ticket() {
    let tid: number | null = null;
    const startTime = Date.now();
    const animation = (fn: StartFun) => {
      tid = requestAnimationFrame(animation.bind(this, fn));
      const seconds = (Date.now() - startTime) / 1000; // 转换为秒
      fn && fn(seconds);
    };
    return {
      start: (fn: StartFun) => animation(fn),
      stop: () => {
        if (tid) {
          cancelAnimationFrame(tid);
          tid = null;
        }
      }
    };
  }

  /**
   * resize事件
   */
  resizeHandle() {
    this.bound = this.container.getBoundingClientRect();
    this.width = this.bound.width;
    this.height = this.bound.height;
    this.camera.aspect = this.width / this.height;
    // 手动通知相机 更新投影矩阵
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}
