import * as dotenv from 'dotenv'
import * as Path from 'node:path/posix'

import readArgs from './read-args.js'
import formatDate from './format-date.js'
import usage from './usage.js'

import exampleEnv from './example-env.js'
import runner from './runner.js'
import createSchedule from './schedules/index.js'
import makeLocalClone from './make-local-clone.js'
import PROGRAM_NAME from './app-name.js'
import version from './app-version.js'
import forward from './forward.js'

// const MONOREPO_NAME = 'challenges'
/**
 *
 * @param  {...string} args
 * @returns {import('./infra/Infra.js').Eff<void>}
 */
const main =
  (...args) =>
  async (eff) => {
    // we do this before anything else because --help and --version
    // both exit early
    const flags = readArgs(args)
    if (flags.help) {
      eff.stdout.write(usage)
      return
    }

    if (flags.version) {
      eff.stdout.write(`${PROGRAM_NAME} v${version}\n`)
      return
    }

    let env = eff.env()
    eff.stdout.write(`${PROGRAM_NAME} running...\n`)

    const SPORK_DIRECTORY = Path.resolve(
      eff.cwd(),
      env.SPORK_DIRECTORY || `${env.HOME}/.${PROGRAM_NAME}`
    )
    const DEFAULT_SCHEDULE = Path.join(SPORK_DIRECTORY, 'schedule.js')

    const envPath = Path.join(SPORK_DIRECTORY, 'env')

    if (!eff.fsExists(SPORK_DIRECTORY)) {
      await eff.fsMkDir(SPORK_DIRECTORY)
      await eff.fsWrite(
        envPath,
        exampleEnv(env.GITHUB_USER || '', env.GITHUB_ACCESS_TOKEN || '')
      )
    }

    const reposPath = Path.join(SPORK_DIRECTORY, 'repos')
    if (!eff.fsExists(reposPath)) {
      await eff.fsMkDir(reposPath)
    }

    if (flags.init) {
      eff.stdout.write(`called with --init so we're all done here\n`)
      return
    }

    // load ~/.spork/env
    if (eff.fsExists(envPath)) {
      eff.stdout.write(`"${envPath}" exists, loading vars\n\n`)
      const bytes = await eff.fsReadFile(envPath, 'utf8')
      const cfg = dotenv.parse(bytes)
      env = { ...cfg, ...env }
    }

    if (flags.createSchedule) {
      if (!(flags.campus && flags.startDate && flags.cohortOrg)) {
        eff.stdout.write(`required flags for create-schedule missing:
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
        // @ts-ignore
        flags.campus,
        flags.cohortOrg
      )

      if (eff.fsExists(schedulePath) && !flags.overwrite) {
        eff.stdout.write(
          `File exists at ${schedulePath}, not overwriting without the --overwrite flag\n`
        )
        return
      }

      await eff.fsWrite(schedulePath, scheduleJs, 'utf8')
      eff.stdout.write(`Wrote new schedule to ${schedulePath}\n`)
      return
    }

    const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = env
    if (!GITHUB_USER) {
      throw new Error('Environment Variable GITHUB_USER is undefined')
    }

    if (!GITHUB_ACCESS_TOKEN) {
      throw new Error('Environment Variable GITHUB_ACCESS_TOKEN is undefined')
    }

    const MONOREPO_PATH = Path.join(reposPath, 'challenges')
    const MONOREPO_URL = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/dev-academy-challenges/challenges`
    if (!eff.fsExists(MONOREPO_PATH)) {
      eff.stdout.write(`Monorepo doesn't exist at ${MONOREPO_PATH}. Cloning\n`)
      const clone = eff.spawn(eff.cwd(), 'git', [
        'clone',
        MONOREPO_URL,
        MONOREPO_PATH,
      ])
      await forward(clone, eff)
    } else {
      eff.stdout.write(`Monorepo exists at ${MONOREPO_PATH}, updating\n`)
      const pull = eff.spawn(MONOREPO_PATH, 'git', [
        'pull',
        MONOREPO_URL,
        'main:main',
      ])

      await forward(pull, eff)
    }

    if (flags.makeLocalClone) {
      await makeLocalClone(
        flags.makeLocalClone,
        flags.branch
      )({
        ...eff,
        env: () => ({ ...env, GITHUB_USER, GITHUB_ACCESS_TOKEN }),
      })
      eff.stdout.write(`called with --make-local-fork so we're done here\n`)
      return
    }

    // @ts-ignore
    const today = eff.newDate()
    const tomorrow = eff.newDate(+today + 24 * 60 * 60 * 1000)
    const targetDate =
      flags.date === 'today' || flags.date == null
        ? today
        : flags.date === 'tomorrow'
        ? tomorrow
        : eff.newDate(flags.date)

    if (!flags.schedule && !eff.fsExists(DEFAULT_SCHEDULE)) {
      eff.stdout.write(`No schedule means nothing to do\n`)
      return
    }

    const schedulePath = Path.resolve(
      eff.cwd(),
      flags.schedule || DEFAULT_SCHEDULE
    )

    eff.stdout.write(`Loading schedule from ${schedulePath}\n`)
    const schedule = await eff.import(schedulePath)

    const cfg = {
      date: formatDate(targetDate),
      event: flags.event,
      dryRun: !!flags.dryRun,
      repoPath: MONOREPO_PATH,
    }

    await runner(
      cfg,
      schedule.default
    )({
      ...eff,
      env: () => ({ ...eff.env(), GITHUB_USER, GITHUB_ACCESS_TOKEN }),
    })
  }

export default main
