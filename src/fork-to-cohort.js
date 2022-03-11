const forkToCohort = (repoPath, cohort, challengeName) => async (eff) => {
  await eff.createRepo(cohort, challengeName)

  await eff.spawn(repoPath, `git`, [
    'subtree',
    'push',
    `--prefix=packages/${challengeName}`,
    `git@github.com:${cohort}/${challengeName}`,
    `main`,
  ])
}

module.exports = forkToCohort
