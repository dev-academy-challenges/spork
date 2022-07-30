const readArgs = (arr) => {
  let i = 0
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

      case '--dry-run':
        flags.dryRun = true
        break

      case '--create-schedule':
        flags.createSchedule = true
        break

      case '--campus':
        flags.campus = arr[i++]
        break

      case '--start-date':
        flags.startDate = arr[i++]
        break

      case '--cohort-org':
        flags.cohortOrg = arr[i++]
        break

      case '--overwrite':
        flags.overwrite = true
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
        throw new Error(`Unknown flag: ${chunk}`)
    }
  }

  return flags
}

export default readArgs
