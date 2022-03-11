const readArgs = (arr) => {
  let i = 0
  const positional = []
  const flags = {}

  while (i < arr.length) {
    const chunk = arr[i++]
    switch (chunk) {
      case '-v':
      case '--version':
        flags.version = true
        break

      case '-h':
      case '--help':
        flags.help = true
        break

      case '--init':
        flags.init = true
        break

      case '-s':
      case '--schedule':
        flags.schedule = arr[i++]
        break

      case '-d':
      case '--for-date':
        flags.date = arr[i++]
        break

      default:
        if (chunk.startsWith('-')) {
          throw new Error(`Unknown flag: ${chunk}`)
        }

        positional.push(chunk)
    }
  }

  return { flags, positional }
}

module.exports = readArgs
