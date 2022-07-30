import { Transform } from 'node:stream'

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

export default censorStream
