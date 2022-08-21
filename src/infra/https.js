import * as https from 'node:https'

/**
 *
 * @param {{ body: string } &  import('node:https').RequestOptions } args
 * @returns {Promise<void>}
 */
const request = (args) => {
  const { body, ...options } = args

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode === 201 || res.statusCode === 200) {
        resolve()
      } else {
        reject(res.statusCode)
      }
    })

    req.on('error', (e) => {
      reject(e)
    })

    req.end(body, 'utf8')
  })
}

export { request }
