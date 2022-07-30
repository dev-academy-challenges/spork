// const { Transform } = require('stream')
import { Transform } from 'node:stream'

const timestampStream = (prefix) => {
  let newline_waiting = true

  const stamp = (str) =>
    `[${prefix || ''}${new Date().toLocaleString()}] ${str}`

  return new Transform({
    transform(chunk, encoding, callback) {
      const str = chunk.toString()
      let start = 0
      let end = str.indexOf('\n')
      let response = ''

      while (end !== -1) {
        if (newline_waiting) {
          response += stamp(str.slice(start, end + 1))
        } else {
          response += str.slice(start, end + 1)
        }
        newline_waiting = true

        start = end + 1
        end = str.indexOf('\n', start)
      }

      if (str.slice(start) !== '') {
        if (newline_waiting) {
          newline_waiting = false
          response += stamp(str.slice(start))
        } else {
          response += str.slice(start)
        }
      }

      callback(null, response)
    },
  })
}

export default timestampStream
