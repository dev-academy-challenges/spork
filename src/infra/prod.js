const FS = require('fs').promises
const { existsSync: fsExists } = require('fs')

const { spawn } = require('./child-process')
const { version } = require('../../package.json')
const { post } = require('./https')

module.exports = {
  writeStdout: (str) => process.stdout.write(str),
  env: () => process.env,
  spawn: (...args) => spawn(...args),
  cwd: () => process.cwd(),
  fsExists: (...args) => fsExists(...args),
  fsMkDir: (...args) => FS.mkdir(...args),
  fsWrite: (...args) => FS.writeFile(...args),
  fsReadFile: (...args) => FS.readFile(...args),
  require: (path) => require(path),
  newDate: (...args) => new Date(...args),
  version: () => version,
  post: (...args) => post(...args),
}
