const main = require('./src/index')

main(...process.argv.slice(2)).catch((err) => {
  process.stderr.write(`${err.toString()}\n`)
  process.exitCode = 1
})
