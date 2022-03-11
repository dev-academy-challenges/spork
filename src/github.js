const https = require('https')

const createRepo = (org, name, env) =>
  new Promise((resolve, reject) => {
    const { GITHUB_ACCESS_TOKEN, GITHUB_USER } = env
    const authString = `${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}`
    const authBlob = Buffer.from(authString)
    const authBase64 = authBlob.toString('base64')

    const options = {
      hostname: 'api.github.com',
      path: `/orgs/${org}/repos`,
      port: 443,
      method: 'POST',
      headers: {
        'User-Agent': 'fork-to-cohort',
        Authorization: `Basic ${authBase64}`,
        'Content-Type': 'application/json',
      },
    }

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

    req.end(JSON.stringify({ name }), 'utf8')
  })

module.exports = { createRepo }
