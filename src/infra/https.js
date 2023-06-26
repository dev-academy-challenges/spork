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
        let json = ''
        res.setEncoding('utf-8')
        res.on('data', (data) => {
          json += data
        })
        res.on('close', () => {
          try {
            const obj = JSON.parse(json)
            for (const { message } of obj.errors) {
              console.error(message)
            }
          } catch (e) {
            console.error(e)
          }
          reject(new Error(`${res.statusCode} ${res.statusMessage}`))
        })
      }
    })

    req.on('error', (e) => {
      reject(e)
    })

    req.end(body, 'utf8')
  })
}

export { request }
