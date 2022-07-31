import * as CP from 'node:child_process'
import timestampStream from './timestamp.js'
import censorStream from './censor.js'

/**
 * @param {string} cwd
 * @param {string} name
 * @param {string[]} args
 * @param {{ secret: string }} opts
 * @returns
 */
const spawn = (cwd, name, args, opts) =>
  new Promise((resolve, reject) => {
    const child = CP.spawn(name, args || [], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd,
    })

    const { secret } = opts || {}
    child.stderr
      .pipe(censorStream(secret))
      .pipe(timestampStream(`(${name}:err) `))
      .pipe(process.stdout)

    child.stdout
      .pipe(censorStream(secret))
      .pipe(timestampStream(`(${name}:out) `))
      .pipe(process.stdout)
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

export { spawn }
