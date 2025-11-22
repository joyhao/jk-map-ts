import * as THREE from 'three';
import * as d3 from 'd3';
import type { City } from '@/data';


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
export function geoEach(item: City['features'][0], callback: Function) {
  const { geometry } = item;
  let geometryList: [] = [];
  geometry.coordinates.forEach((shapes) => {
    const geometries = callback && (callback(shapes) as []);

    geometryList.push(...geometries);
  });

  return geometryList;
}

/**
 * 纹理uv计算, 纹理映射
 * @param {*} mergedGeometry
 * @param {*} texture
 */
export function uvCalc(mergedGeometry: THREE.BufferGeometry) {
  mergedGeometry.computeBoundingBox();
  const { min, max } = mergedGeometry.boundingBox as THREE.Box3;
  const width = max.x - min.x;
  const height = max.y - min.y;

  const uvArray = new Float32Array(
    mergedGeometry.attributes.position.count * 2
  );
  mergedGeometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
  const uvAttribute = mergedGeometry.attributes.uv;
  const positions = mergedGeometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const u = (x - min.x) / width;
    const v = (y - min.y) / height;
    uvAttribute.setXY(i, u, v);
  }
  mergedGeometry.attributes.uv.needsUpdate = true;

  return mergedGeometry;
}

/**
 * 更新shader时间函数
 * @param time
 * @param mainGroup
 */
export function gslUpdateTime(time: number, mainGroup: THREE.Group) {
  let shaderMesh = null;
  let material = null;

  if (!shaderMesh) {
    shaderMesh = mainGroup.children.find(
      (child) => child.userData.shaderMaterial
    );
  }

  if (shaderMesh) {
    material = shaderMesh.userData.shaderMaterial;
  }

  // 持续更新 time uniform 的值
  if (material) {
    material.uniforms.time.value = time;
  }
}
