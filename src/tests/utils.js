/**
 *
 * @param {import('node:stream').Duplex} stream
 * @returns {Promise<string>}
 */

export function readTilEnd(stream) {
  return new Promise((resolve, reject) => {
    let result = ''
    stream.on('data', (chunk) => {
      result += chunk
    })

    stream.on('finish', () => {
      resolve(result)
    })

    stream.on('error', (e) => {
      reject(e)
    })

    stream.resume()
    stream.end()
  })
}
