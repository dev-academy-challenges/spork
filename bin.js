#!/usr/bin/env node

import main from './src/index.js'

main(...process.argv.slice(2)).catch((err) => {
  if (err != null && err.message) {
    process.stderr.write(`${err.message}\n`)
  } else {
    process.stderr.write(`Unknown failure\n`)
  }
  process.exitCode = 1
})
