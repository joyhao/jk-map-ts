import * as THREE from 'three';
import * as d3 from 'd3';
import type { QuXian } from '@/data';

// 转换经纬度到屏幕坐标

export const projectPos = (coord: number[]) => {
  const fun = d3.geoMercator();
  // @ts-ignore
  return fun(coord) as [number, number];
};

/**
 * 角度转弧度
 * @param angle
 * @returns
 */
export function toRad(angle: number): number {
  // 将任何角度值映射到 0 到 360 范围内
  const normalizedAngle = angle % 360;
  return THREE.MathUtils.degToRad(normalizedAngle);
}

/**
 * 获取包围盒
 * @param box
 * @returns
 */
export function getBox(box: THREE.Object3D) {
  return new THREE.Box3().setFromObject(box);
}

/**
 *
 * @param box
 * @returns
 */
export function getSize(box: THREE.Object3D) {
  const b = getBox(box);
  return b.getSize(new THREE.Vector3());
}

/**
 * 获取集合体中点点
 * @param box
 * @returns
 */
export function getCenter(box: THREE.Object3D) {
  const b = getBox(box);
  return b.getCenter(new THREE.Vector3());
}

/**
 *
 * @param item
 * @param callback
 */
export function geoEach(item: QuXian['features'][0], callback: Function) {
  const { geometry } = item;
  let geometryList: THREE.ExtrudeGeometry[] = [];
  geometry.coordinates.forEach((shapes) => {
    const geometries = callback && callback(shapes);
    geometryList.push(...geometries);
  });

  return geometryList;
}
