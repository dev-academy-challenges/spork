const { spawn } = require('./utils/child-process')
const FS = require('fs').promises
const Path = require('path/posix')
const { existsSync: fsExists } = require('fs')
const { run } = require('./runner')
const { version } = require('../package.json')
const { createRepo } = require('./github')

module.exports = {
  writeStdout: (str) => process.stdout.write(str),
  env: () => process.env,
  spawn: (...args) => spawn(...args),
  cwd: () => process.cwd(),
  fsExists: (...args) => fsExists(...args),
  fsMkDir: (...args) => FS.mkdir(...args),
  fsWrite: (...args) => FS.writeFile(...args),
  fsReadFile: (...args) => FS.readFile(...args),
  joinPath: (...args) => Path.join(...args),
  resolvePath: (...args) => Path.resolve(...args),
  require: (path) => require(path),
  run: (...args) => run(...args),
  newDate: (...args) => new Date(...args),
  version: () => version,
  createRepo: (org, name) => createRepo(org, name, process.env),
}
