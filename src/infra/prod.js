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

export default {
  writeStdout: (str) => process.stdout.write(str),
  env: () => process.env,
  spawn: (...args) => spawn(...args),
  cwd: () => process.cwd(),
  fsExists: (...args) => existsSync(...args),
  fsMkDir: (...args) => FS.mkdir(...args),
  fsWrite: (...args) => FS.writeFile(...args),
  fsReadFile: (...args) => FS.readFile(...args),
  require: (path) => require(path),
  newDate: (...args) => new Date(...args),
  version: () => version,
  post: (...args) => post(...args),
}
