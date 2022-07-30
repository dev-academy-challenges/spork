import Prettier from 'prettier'

import compile from './compiler.js'
import template from './template.js'

const create = (start, campus, dest) => {
  const src = compile(start, campus, dest, template)

  const pretty = Prettier.format(src, {
    semi: false,
    singleQuote: true,
    parser: 'babel',
  })

  return pretty
}

export default create
