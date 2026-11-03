import it from 'ava'


it('throws an error for duplicate references', (test) => {
  test.throws(
    () => shaven(['div', ['p$foo'], ['p$foo']]),
    {message: 'References must be unique and "foo" is already assigned'},
  )
})
