const { Transform } = require('stream')

const censorStream = (forbidden) => {
  const stamp = forbidden.replace(/./g, '*')
  return new Transform({
    transform: (chunk, encoding, callback) => {
      if (forbidden) {
        callback(null, chunk.toString().split(forbidden).join(stamp))
      } else {
        callback(null, chunk.toString())
      }
    },
  })
}
module.exports = censorStream
