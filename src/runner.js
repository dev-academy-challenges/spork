// const Path = require('path/posix')

// const forkToCohort = require('./fork-to-cohort')
import * as Path from 'node:path/posix'
import forkToCohort from './fork-to-cohort.js'

/**
 *
 * @param {{ dryRun: boolean, repoPath: string, date: string }} cfg
 * @param {(_: (date: string) => { deploy: (...repos: string[]) => ({ to: (cohort: string) => void })}) => void} f
 * @returns {import('./infra/Infra.js').Eff<void>}
 */
const runner = (cfg, f) => async (eff) => {
  /**
   *
   * @param {string} date
   * @param {string[]} repos
   * @param {string} cohort
   * @param {{ task: () => Promise<unknown>, repo: string }[]} queue
   */
  const doit = (date, repos, cohort, queue) => {
    if (date === cfg.date) {
      for (const repo of repos) {
        const task = async () => {
          eff.writeStdout(`deploying ${repo} to ${cohort} \n`)
          const pathToSubtree = Path.join(cfg.repoPath, 'packages', repo)
          if (!eff.fsExists(pathToSubtree)) {
            throw new Error(`${repo} doesn't exist in monorepo`)
          }

          if (!cfg.dryRun) {
            await forkToCohort(cfg.repoPath, cohort, repo)(eff)
          }
        }

        queue.push({ repo, task })
      }
    }
  }

  /**
   * @type {{ task: () => Promise<unknown>, repo: string }[]}
   */
  const queue = []
  // `f` should look something like this, so this weird object is
  // to unwrap that fancy syntax:
  //
  //   (on) => {
  //     on('2022-3-15')
  //       .deploy(
  //           'two-truths-and-a-lie',
  //           'object-and-arrays-kata'
  //       )
  //       .to('some-cohort-name')
  //   }
  //
  /**
   *
   * @param {string} date
   * @returns {{ deploy: (...repos: string[]) => ({ to: (cohort: string) => void })}}
   */
  const on = (date) => ({
    deploy: (...repos) => ({
      to: (cohort) => {
        doit(date, repos, cohort, queue)
      },
    }),
  })

  f(on)

  const failures = []
  for (const { repo, task } of queue) {
    try {
      await task()
    } catch (error) {
      failures.push({ repo, error })
    }
  }

  for (const { repo, error } of failures) {
    // @ts-ignore
    eff.writeStdout(`deploying ${repo} failed with ${error.message}\n`)
  }

  if (failures.length === 1) {
    throw failures[0].error
  }

  if (failures.length > 0) {
    throw new Error(`One or more repos failed to deploy`)
  }
}

export default runner
