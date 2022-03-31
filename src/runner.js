const Path = require('path/posix')

const forkToCohort = require('./fork-to-cohort')

const runner = (cfg, f) => async (eff) => {
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
    eff.writeStdout(`deploying ${repo} failed with ${error.message}\n`)
  }

  if (failures.length === 1) {
    throw failures[0].error
  }

  if (failures.length > 0) {
    throw new Error(`One or more repos failed to deploy`)
  }
}

module.exports = runner
