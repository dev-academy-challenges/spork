import * as FS from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawn } from './child-process.js'
import { request } from './https.js'
import * as OS from 'node:os'

/**
 * @type {import('./Infra').IInfra}
 */
export default {
  env: () => process.env,
  spawn: (...args) =>
    // @ts-ignore
    spawn(...args),
  cwd: () => process.cwd(),
  fsExists: (...args) => existsSync(...args),
  fsMkDir: (...args) => FS.mkdir(...args),
  fsMkDTemp: (...args) => FS.mkdtemp(...args),
  tmpDir: (...args) => OS.tmpdir(...args),
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
