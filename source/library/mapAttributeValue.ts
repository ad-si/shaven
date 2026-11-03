import buildTransformString from './buildTransformString.ts'
import stringifyStyleObject from './stringifyStyleObject.ts'
import type {
  AttributeValue,
  StyleObject,
  TransformObject,
} from './types.ts'

export default (
  key: string,
  value: AttributeValue,
): Exclude<AttributeValue, StyleObject | TransformObject[]> => {
  if (value === undefined) {
    return ''
  }

  if (key === 'style' && typeof value === 'object' && value !== null) {
    return stringifyStyleObject(value as StyleObject)
  }

  if (key === 'transform' && Array.isArray(value)) {
    return buildTransformString(value)
  }

  return value as Exclude<AttributeValue, StyleObject | TransformObject[]>
}
