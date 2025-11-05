export type StartFun = (seconds: number) => void;

/**
 * hasHover 是否需要鼠标移入效果
 */
export interface UserData {
  name: string;
  type: '省' | '市' | '区';
  hasHover: boolean;
}
