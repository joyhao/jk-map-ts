import * as THREE from 'three';

export const defaultMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: '#4582F9',
    transparent: true,
    opacity: 1
  });
};

export const lineMaterial = () => {
  return new THREE.LineBasicMaterial({
    color: '#fff'
  });
};
