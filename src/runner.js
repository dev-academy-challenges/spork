const forkToCohort = require('./fork-to-cohort')

const runner = (cfg, f) => async (eff) => {
  const doit = async (date, repos, cohort) => {
    if (date === cfg.date) {
      for (const repo of repos) {
        eff.writeStdout(`deploying ${repo} to ${cohort} \n`)
        if (!cfg.dryRun) {
          await forkToCohort(cfg.repoPath, cohort, repo)(eff)
        }
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
      to: (cohort) => queue.push(() => doit(date, repos, cohort)),
    }),
  })

  f(on)

  for (const task of queue) {
    await task()
  }
}

module.exports = runner
