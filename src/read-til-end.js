/**
 *
 * @param {import('node:stream').Readable} stream
 * @returns {Promise<string>}
 */
export default function readTilEnd(stream) {
  return new Promise((resolve, reject) => {
    let result = ''
    stream.on('data', (chunk) => {
      result += chunk
    })

    stream.on('end', () => {
      resolve(result)
    })

    stream.on('error', (e) => {
      reject(e)
    })

    stream.resume()
    // stream.end()
  })
}
