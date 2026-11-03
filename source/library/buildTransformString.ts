import type {TransformObject} from './types.ts'

// Create transform string from list transform objects

export default (transformObjects: TransformObject[]): string => {

  return transformObjects
    .map(transformation => {
      const values: number[] = []

      if (
        transformation.type === 'rotate' &&
        Number.isFinite(transformation.degrees)
      ) {
        values.push(transformation.degrees as number)
      }

      if (Number.isFinite(transformation.x)) {
        values.push(transformation.x as number)
      }
      if (Number.isFinite(transformation.y)) {
        values.push(transformation.y as number)
      }

      return `${transformation.type}(${values.join(',')})`
    })
    .join(' ')
}
