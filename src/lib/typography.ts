/**
 * 一些非 CJK 的排版字符在数据录入过程中容易被吞掉，
 * 所以数据层统一用 ASCII 写法（... 与 --），在这里做一次集中转换。
 * 好处是数据文件保持纯 ASCII 安全，排版细节仍然可控、可测。
 */
export function typograph(input: string): string {
  return input.replace(/\.\.\./g, '\u2026').replace(/--/g, '\u2014')
}