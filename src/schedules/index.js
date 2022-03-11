const compile = require('./compiler')
const template = require('./template')
const Prettier = require('prettier')

const create = (start, campus, dest) => {
  const src = compile(start, campus, dest, template)

  const pretty = Prettier.format(src, {
    semi: false,
    singleQuote: true,
    parser: 'babel',
  })

  return pretty
}
module.exports = create
