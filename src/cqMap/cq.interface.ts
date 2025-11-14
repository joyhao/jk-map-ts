import * as THREE from 'three';

export type StartFun = (seconds: number) => void;

/**
 * hasHover 是否需要鼠标移入效果
 */
export interface UserData {
  name: string;
  type: string;
  hasHover: boolean;
  shaderMaterial?: THREE.ShaderMaterial;
}
