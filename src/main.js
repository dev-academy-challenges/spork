const readArgs = require('./read-args')
const formatDate = require('./format-date')
const usage = require('./usage')

const PROGRAM_NAME = 'sosij'

const main =
  (...args) =>
  async (eff) => {
    const { flags } = readArgs(args)
    if (flags.help) {
      eff.writeStdout(usage)
      return
    }

    if (flags.version) {
      eff.writeStdout(`${PROGRAM_NAME} v${eff.version()}\n`)
      return
    }

    eff.writeStdout(`${PROGRAM_NAME} running...\n`)

    const SOSIJ_DIRECTORY = eff.resolvePath(
      eff.env().SOSIJ_DIRECTORY || `${eff.env().HOME}/.sosij`
    )

    const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = eff.env()
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

    eff.writeStdout(`schedule = ${flags.schedule}\n`)

    const today = eff.newDate()
    const tomorrow = eff.newDate(+today + 24 * 60 * 60 * 1000)
    const targetDate =
      flags.date === 'today' || flags.date == null
        ? today
        : flags.date === 'tomorrow'
        ? tomorrow
        : eff.newDate(flags.date)

    eff.writeStdout(`targetDate is ${formatDate(targetDate)}\n`)

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

module.exports = main
