import quxian from '@/data/重庆市区.json';
import shi from '@/data/重庆市.json';

/**
 * 返回区县数据
 * @returns
 */
export function getQuXian() {
  return quxian;
}

/**
 * 返回市
 * @returns
 */
export function getShi() {
  return shi;
}

export type QuXian = ReturnType<typeof getQuXian>;
