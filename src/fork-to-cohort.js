const forkToCohort = (repoPath, cohort, challengeName, env) => async (eff) => {
  const pathToSubtree = eff.joinPath(repoPath, 'packages', challengeName)
  if (!eff.fsExists(pathToSubtree)) {
    throw new Error(`${challengeName} doesn't exist in monorepo`)
  }

  const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = env
  const url = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/${cohort}/${challengeName}.git`

  await eff.createRepo(cohort, challengeName)

  await eff.spawn(repoPath, `git`, [
    'subtree',
    'push',
    `--prefix=packages/${challengeName}`,
    url,
    `main`,
  ])
}

module.exports = forkToCohort
