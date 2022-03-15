const https = require('https')

const post = (args) => {
  const { body, ...options } = args

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode === 201) {
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

module.exports = { post }
