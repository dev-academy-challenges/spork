// const FS = require('fs').promises
import * as FS from 'node:fs/promises'
// const { existsSync: fsExists } = require('fs')
import { existsSync } from 'node:fs'

// const { spawn } = require('./child-process')
import { spawn } from './child-process.js'
// const { version } = require('../../package.json')

// const { post } = require('./https')
import { post } from './https.js'

const version = '1.0.0'
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
  require: (path) => require(path),
  newDate: (...args) => new Date(...args),
  version: () => version,
  // @ts-ignore
  post: (...args) => post(...args),
}
