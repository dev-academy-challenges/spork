import * as FS from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawn } from './child-process.js'
import { request } from './https.js'

/**
 * @type {import('./Infra').IInfra}
 */
export default {
  writeStdout: (str) => process.stdout.write(str),
  env: () => process.env,
  // @ts-ignore
  spawn: (...args) => spawn(...args),
  cwd: () => process.cwd(),
  fsExists: (...args) => existsSync(...args),
  fsMkDir: (...args) => FS.mkdir(...args),
  fsWrite: (...args) => FS.writeFile(...args),
  fsReadFile: FS.readFile,
  import: (path) => import(path),
  newDate: (...args) => new Date(...args),
  // @ts-ignore
  request: (...args) => request(...args),
}
