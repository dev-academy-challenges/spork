const dotenv = require('dotenv')
const Path = require('path/posix')

const readArgs = require('./read-args')
const formatDate = require('./format-date')
const usage = require('./usage')
const exampleEnv = require('./example-env')
const runner = require('./runner')
const createSchedule = require('./schedules/index')
const PROGRAM_NAME = require('./app-name')

const main =
  (...args) =>
  async (eff) => {
    // we do this before anything else because --help and --version
    // both exit early
    const flags = readArgs(args)
    if (flags.help) {
      eff.writeStdout(usage)
      return
    }

    if (flags.version) {
      eff.writeStdout(`${PROGRAM_NAME} v${eff.version()}\n`)
      return
    }

    let env = eff.env()
    eff.writeStdout(`${PROGRAM_NAME} running...\n`)

    const SOSIJ_DIRECTORY = Path.resolve(
      eff.cwd(),
      env.SOSIJ_DIRECTORY || `${env.HOME}/.${PROGRAM_NAME}`
    )
    const DEFAULT_SCHEDULE = Path.join(SOSIJ_DIRECTORY, 'schedule.js')

    const envPath = Path.join(SOSIJ_DIRECTORY, 'env')

    if (!eff.fsExists(SOSIJ_DIRECTORY)) {
      await eff.fsMkDir(SOSIJ_DIRECTORY)
      await eff.fsWrite(
        envPath,
        exampleEnv(env.GITHUB_USER || '', env.GITHUB_ACCESS_TOKEN || '')
      )
    }

    if (flags.init) {
      eff.writeStdout(`called with --init so we're all done here\n`)
      return
    }

    // load ~/.sosij/env
    if (eff.fsExists(envPath)) {
      eff.writeStdout(`"${envPath}" exists, loading vars\n\n`)
      const bytes = await eff.fsReadFile(envPath, 'utf8')
      const cfg = dotenv.parse(bytes)
      env = { ...cfg, ...env }
    }

    if (flags.createSchedule) {
      if (!(flags.campus && flags.startDate && flags.cohortOrg)) {
        eff.writeStdout(`required flags for create-schedule missing:
--campus welly | akl | online
--start-date YYYY-MM-DD
--cohort-org org-name\n`)
        throw new Error('required flags missing')
      }

      if (!['welly', 'akl', 'online'].includes(flags.campus)) {
        throw new Error(
          `Invalid campus: ${flags.campus} must be one of welly, akl, online`
        )
      }

      if (isNaN(+eff.newDate(flags.startDate))) {
        throw new Error(`Invalid start-date: ${flags.startDate}`)
      }

      const schedulePath = Path.resolve(
        eff.cwd(),
        flags.schedule || DEFAULT_SCHEDULE
      )
      const scheduleJs = createSchedule(
        eff.newDate(flags.startDate),
        flags.campus,
        flags.cohortOrg
      )

      if (eff.fsExists(schedulePath) && !flags.overwrite) {
        eff.writeStdout(
          `File exists at ${schedulePath}, not overwriting without the --overwrite flag\n`
        )
        return
      }

      await eff.fsWrite(schedulePath, scheduleJs, 'utf8')
      eff.writeStdout(`Wrote new schedule to ${schedulePath}\n`)
      return
    }

    const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = env
    if (!GITHUB_USER) {
      throw new Error('Environment Variable GITHUB_USER is undefined')
    }

    if (!GITHUB_ACCESS_TOKEN) {
      throw new Error('Environment Variable GITHUB_ACCESS_TOKEN is undefined')
    }

    const MONOREPO_PATH = Path.join(SOSIJ_DIRECTORY, 'monorepo-trial')
    const MONOREPO_URL = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/dev-academy-challenges/monorepo-trial`
    if (!eff.fsExists(MONOREPO_PATH)) {
      eff.writeStdout(`Monorepo doesn't exist at ${MONOREPO_PATH}. Cloning\n`)
      await eff.spawn(
        eff.cwd(),
        'git',
        ['clone', MONOREPO_URL, MONOREPO_PATH],
        { secret: GITHUB_ACCESS_TOKEN }
      )
    } else {
      eff.writeStdout(`Monorepo exists at ${MONOREPO_PATH}, updating\n`)
      await eff.spawn(MONOREPO_PATH, 'git', ['pull', MONOREPO_URL, 'main'], {
        secret: GITHUB_ACCESS_TOKEN,
      })
    }

    const today = eff.newDate()
    const tomorrow = eff.newDate(+today + 24 * 60 * 60 * 1000)
    const targetDate =
      flags.date === 'today' || flags.date == null
        ? today
        : flags.date === 'tomorrow'
        ? tomorrow
        : eff.newDate(flags.date)

    if (!flags.schedule && !eff.fsExists(DEFAULT_SCHEDULE)) {
      eff.writeStdout(`No schedule means nothing to do\n`)
      return
    }

    const schedulePath = Path.resolve(
      eff.cwd(),
      flags.schedule || DEFAULT_SCHEDULE
    ).replace(/\.js$/, '')

    eff.writeStdout(`Loading schedule from ${schedulePath}\n`)
    const schedule = eff.require(schedulePath)

    const cfg = {
      date: formatDate(targetDate),
      dryRun: !!flags.dryRun,
      repoPath: MONOREPO_PATH,
    }

    await runner(
      cfg,
      schedule
    )({
      ...eff,
      env: () => ({ ...eff.env(), GITHUB_USER, GITHUB_ACCESS_TOKEN }),
    })
  }

module.exports = main
