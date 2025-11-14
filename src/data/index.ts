import qx from '@/data/重庆市区.json';
import su from '@/data/重庆市.json';
import rk from '@/data/重庆市区人口.json';

/**
 * 返回区县数据
 * @returns
 */
export function getQuXian() {
  return qx;
}

/**
 * 返回市
 * @returns
 */
export function getShiQu() {
  return su as City;
}

export function getRenKou() {
  return rk;
}

export type City = ReturnType<typeof getQuXian>;
export type RenKou = ReturnType<typeof getRenKou>;

export const quXian = getQuXian();
export const shiQu = getShiQu();
export const renKou = getRenKou();
