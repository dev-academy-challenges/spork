import * as CP from 'node:child_process'
import timestampStream from './timestamp.js'
import censorStream from './censor.js'

/**
 * @param {{stdout: import('node:stream').Writable, stderr: import('node:stream').Writable}} streams
 * @param {string} cwd
 * @param {string} name
 * @param {string[]} args
 * @param {{ secret?: string}} opts
 * @returns
 */
export const spawn = (streams, cwd, name, args, opts) =>
  new Promise((resolve, reject) => {
    const child = CP.spawn(name, args || [], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd,
    })

    const { secret } = opts || {}
    child.stderr
      .pipe(censorStream(secret))
      .pipe(timestampStream(`(${name}:err) `))
      .pipe(streams.stderr, { end: false })

    child.stdout
      .pipe(censorStream(secret))
      .pipe(timestampStream(`(${name}:out) `))
      .pipe(streams.stdout, { end: false })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve(null)
        return
      }
      reject(new Error(`Process ${name} exited with code ${code}`))
    })

    child.on('error', (err) => {
      reject(err)
    })
  })
