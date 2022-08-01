/**
 *
 * @param {string[]} arr
 * @returns
 */
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
        if (arr[i + 1] == null) {
          throw new Error(`value for flag 'campus' not provided`)
        }

        flags.campus = arr[i++]
        break

      case '--start-date':
        if (arr[i + 1] == null) {
          throw new Error(`value for flag 'start-date' not provided`)
        }

        flags.startDate = arr[i++]
        break

      case '--cohort-org':
        if (arr[i + 1] == null) {
          throw new Error(`value for flag 'cohort-org' not provided`)
        }

        flags.cohortOrg = arr[i++]
        break

      case '--overwrite':
        flags.overwrite = true
        break

      case '-s':
      case '--schedule':
        if (arr[i + 1] == null) {
          throw new Error(`path for flag 'schedule' not provided`)
        }

        flags.schedule = arr[i++]
        break

      case '-d':
      case '--for-date':
        if (arr[i + 1] == null) {
          throw new Error(`path for flag 'for-date' not provided`)
        }

        flags.date = arr[i++]
        break

      case '--make-local-clone':
        if (arr[i + 1] == null) {
          throw new Error(`path for flag 'make-local-clone' not provided`)
        }

        flags.makeLocalClone = arr[i++]
        break

      default:
        throw new Error(`Unknown flag: ${chunk}`)
    }
  }

  return flags
}

export default readArgs
