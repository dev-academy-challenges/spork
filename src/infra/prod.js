import * as FS from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawn } from './child-process.js'
import { request } from './https.js'

/**
 * @type {import('./Infra').IInfra}
 */
export default {
  env: () => process.env,
  spawn: (...args) =>
    // @ts-ignore
    spawn({ stdout: process.stdout, stderr: process.stdout }, ...args),
  cwd: () => process.cwd(),
  fsExists: (...args) => existsSync(...args),
  fsMkDir: (...args) => FS.mkdir(...args),
  fsWrite: (...args) => FS.writeFile(...args),
  fsReadFile: FS.readFile,
  fsCp: FS.cp,
  import: (path) => import(path),
  newDate: (...args) => new Date(...args),
  // @ts-ignore
  request: (...args) => request(...args),
  stdout: process.stdout,
  stderr: process.stderr,
}
