import * as Path from 'node:path/posix'
import createRepo from './github.js'

const forkToCohort = (repoPath, cohort, challengeName) => async (eff) => {
  const pathToSubtree = Path.join(repoPath, 'packages', challengeName)
  if (!eff.fsExists(pathToSubtree)) {
    throw new Error(`${challengeName} doesn't exist in monorepo`)
  }

  const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = eff.env()
  const url = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/${cohort}/${challengeName}.git`

  await createRepo(cohort, challengeName)(eff)

  await eff.spawn(
    repoPath,
    `git`,
    ['subtree', 'push', `--prefix=packages/${challengeName}`, url, `main`],
    { secret: GITHUB_ACCESS_TOKEN }
  )
}

export default forkToCohort
