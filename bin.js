#!/usr/bin/env node

import main from './src/index.js'

main(...process.argv.slice(2)).catch((err) => {
  process.stderr.write(`${err.toString()}\n`)
  process.exitCode = 1
})
