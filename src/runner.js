const run = async (cfg, f) => {
  const doit = (date, repos, cohort) => {
    if (date === cfg.date) {
      for (const repo of repos) {
        console.log(`DEPLOYING ${repo} to ${cohort}`)
      }
    }
  }

  const on = (date) => ({
    deploy: (...repos) => ({ to: (cohort) => doit(date, repos, cohort) }),
  })

  f(on)
}

module.exports = { run }
