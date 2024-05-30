import * as CP from 'node:child_process'

/**
 * @param {string} cwd
 * @param {string} name
 * @param {string[]} args
 * @returns
 */
export const spawn = (cwd, name, args) => {
  const child = CP.spawn(name, args || [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd,
  })

  const { stdin, stderr, stdout } = child
  const exit = new Promise((resolve, reject) => {
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
  return { stdin, stderr, stdout, exit, name }
}
