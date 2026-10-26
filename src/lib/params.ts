/** 引擎参数一律防御式读取：题材数据是配置，配置可能写错，但界面不能崩 */
export function numParam(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function strParam(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}