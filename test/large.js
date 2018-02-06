/* globals shaven */

import it from 'ava'


it('works with large arrays', (test) => {
  const array = [
    'section.file',
    '',
    [
      'header',
      'path/to/file.js',
      ['button.edit', 'edit', null],
    ],
    ['.body',
      ['p.error', 'ExportDefaultDeclaration'],
      ['.comments', ''],
    ],
  ]
  const actual = shaven(array)
  const html = `
    <section class="file">
      <header>path/to/file.js</header>
      <div class="body">
        <p class="error">ExportDefaultDeclaration</p>
      <div class="comments"></div>
      </div>
    </section>
  `
  const expected = html
    .replace(/>\s+</g, '><')
    .trim()

  test.is(actual.rootElement, expected)
})
