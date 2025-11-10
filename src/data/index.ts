import quXian from '@/data/重庆市区.json';
import shiQu from '@/data/重庆市.json';

/**
 * 返回区县数据
 * @returns
 */
export function getQuXian() {
  return quXian;
}

/**
 * 返回市
 * @returns
 */
export function getShiQu() {
  return shiQu as City;
}

export type City = ReturnType<typeof getQuXian>;
