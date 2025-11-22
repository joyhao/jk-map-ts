import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { getCenter } from './utils';
import jkCore from './jkCore';
import type { Object3D, Object3DEventMap } from 'three';
export default class jkLabel {
  labelRenderer!: CSS2DRenderer;
  jkCore: jkCore;
  constructor(jkCore: jkCore) {
    this.jkCore = jkCore;
    this.jkCore.addEventListener('resize', this.resizeCallback.bind(this));
  }

  resizeCallback() {
    this.labelRenderer.setSize(this.jkCore.width, this.jkCore.height);
  }

  /**
   * 添加标签
   * @param {*} selector
   */
  initLabelRenderer(selector: string) {
    const container = document.querySelector(selector) as HTMLElement;
    const labelRenderer = (this.labelRenderer = new CSS2DRenderer());
    labelRenderer.setSize(this.jkCore.width, this.jkCore.height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none'; // 确保不影响鼠标交互
    container.appendChild(labelRenderer.domElement);
    return labelRenderer;
  }

  createLabel(mesh: Object3D<Object3DEventMap>) {
    const center = getCenter(mesh);
    // 创建 HTML div 元素
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = mesh.userData.name;
    labelDiv.style.color = 'white'; // 设置样式
    labelDiv.style.fontSize = '12px';
    labelDiv.style.textShadow = '1px 1px 2px #000000';

    // 创建 CSS2DObject
    const label = new CSS2DObject(labelDiv);
    // 将标签的位置设置在网格中心，z轴方向略微抬高
    label.position.set(center.x, center.y, 0.2);

    return label;
  }
}
