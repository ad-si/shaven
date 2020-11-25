import * as ace from 'brace'
import 'brace/mode/javascript.js'
import 'brace/mode/html.js'
import 'brace/theme/tomorrow_night.js'

import '../styles/screen.styl'

// TODO: Load fonts with webpack
// require('https://fonts.googleapis.com/css?family=Grand+Hotel')

import fixIndentation from './fixIndentation.js'

Array
  .from(document.getElementsByTagName('textarea'))
  .forEach(element => {
    element.innerHTML = fixIndentation(element.innerHTML)

    const editor = ace.edit(element)

    editor.setTheme('ace/theme/tomorrow_night')

    // Disable annotations
    editor
      .getSession()
      .setUseWorker(false)

    if (element.dataset.lang) {
      editor
        .getSession()
        .setMode('ace/mode/' + element.dataset.lang)

      if (element.dataset.lang === 'html') {
        editor.setReadOnly(true)
      }
    }

    // TODO: Re-enable editing
    editor.setReadOnly(true)
    // if (!element.hasAttribute('readonly')) {
    //  editor.container.classList.add('editable')
    //  editor.getSession().on('change', event => {
    //
    //  })
    // }

    editor.setOptions({minLines: 1, maxLines: 50})
  })
