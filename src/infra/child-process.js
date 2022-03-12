const CP = require('child_process')
const timestampStream = require('./timestamp')

const spawn = (cwd, name, args) =>
  new Promise((resolve, reject) => {
    const child = CP.spawn(name, args || [], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd,
    })
    child.stderr.pipe(timestampStream(`(${name}:err) `)).pipe(process.stdout)
    child.stdout.pipe(timestampStream(`(${name}:out) `)).pipe(process.stdout)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(null)
        return
      }
      reject()
    })

    child.on('error', (err) => {
      reject(err)
    })
  })

module.exports = { spawn }
