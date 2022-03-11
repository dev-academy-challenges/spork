const PROGRAM_NAME = 'sosij'

const main =
  (...args) =>
  async (eff) => {
    eff.writeStdout(`${PROGRAM_NAME} running...\n`)

    const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = eff.env()
    const SOSIJ_DIRECTORY = eff.resolvePath(
      eff.env().SOSIJ_DIRECTORY || `${eff.env().HOME}/.sosij`
    )

    if (!GITHUB_USER) {
      throw new Error('Environment Variable GITHUB_USER is undefined')
    }

    if (!GITHUB_ACCESS_TOKEN) {
      throw new Error('Environment Variable GITHUB_ACCESS_TOKEN is undefined')
    }

    const MONOREPO_PATH = eff.joinPath(SOSIJ_DIRECTORY, 'monorepo-trial')
    const MONOREPO_URL = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/dev-academy-challenges/monorepo-trial`

    if (!eff.fsExists(SOSIJ_DIRECTORY)) {
      await eff.fsMkDir(SOSIJ_DIRECTORY)
    }

    if (!eff.fsExists(MONOREPO_PATH)) {
      eff.writeStdout(`Monorepo doesn't exist at ${MONOREPO_PATH}. Cloning\n`)
      await eff.spawn(eff.cwd(), 'git', ['clone', MONOREPO_URL, MONOREPO_PATH])
    } else {
      eff.writeStdout(`Monorepo exists, updating\n`)
      await eff.spawn(MONOREPO_PATH, 'git', ['pull'])
    }

    const { flags, positional } = readArgs(args)
    const [cohort, challenge] = positional
    const today = new Date()
    const tomorrow = new Date(+today + 24 * 60 * 60 * 1000)

    const targetDate =
      flags.date === 'today' || flags.date == null
        ? today
        : flags.date === 'tomorrow'
        ? tomorrow
        : new Date(flags.date)

    eff.writeStdout(`targetDate is ${formatDate(targetDate)}\n`)
    eff.writeStdout(`cohort = ${cohort}, challenge = ${challenge}\n`)
    eff.writeStdout(`schedule = ${flags.schedule}\n`)

    if (!flags.schedule) {
      eff.writeStdout(`No schedule means nothing to do`)
      return
    }

    const schedulePath = eff.resolvePath(flags.schedule).replace(/\.js$/, '')
    const schedule = eff.require(schedulePath)

    const cfg = {
      date: formatDate(targetDate),
    }

    await eff.run(cfg, schedule)
  }

const readArgs = (arr) => {
  let i = 0
  const positional = []
  const flags = {}

  while (i < arr.length) {
    const chunk = arr[i++]
    console.log(chunk)

    switch (chunk) {
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

const formatDate = (targetDate) => {
  const pad = (s) => (`${s}`.length === 2 ? `${s}` : `0${s}`)

  return `${targetDate.getFullYear()}-${pad(
    targetDate.getMonth() + 1
  )}-${targetDate.getDate()}`
}

module.exports = main
