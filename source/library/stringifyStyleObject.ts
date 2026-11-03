import type {StyleObject} from './types.ts'

function sanitizeProperties (_key: string, value: unknown): unknown {
  if (value === null || value === false || value === undefined) return
  if (typeof value === 'string' || typeof value === 'object') return value

  return String(value)
}

export default (styleObject: StyleObject): string => {
  return JSON
    .stringify(styleObject, sanitizeProperties)
    .slice(2, -2)
    .replace(/","/g, ';')
    .replace(/":"/g, ':')
    .replace(/\\"/g, '\'')
}
