// Create transform string from list transform objects

export default (transformObjects) => {

  return transformObjects
    .map(transformation => {
      const values = []

      if (
        transformation.type === 'rotate' &&
        Number.isFinite(transformation.degrees)
      ) {
        values.push(transformation.degrees)
      }

      if (Number.isFinite(transformation.x)) values.push(transformation.x)
      if (Number.isFinite(transformation.y)) values.push(transformation.y)

      return `${transformation.type}(${values})`
    })
    .join(' ')
}
