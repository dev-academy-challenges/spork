import * as Path from 'node:path/posix'
import { createRepo, setBranchProtection } from './github.js'
import forkToCohortCopy from './fork-to-cohort-copy.js'

/**
 * @param {string} repoPath
 * @param {string} cohort
 * @param {string} challengeName
 * @returns {import('./infra/Infra.js').Eff<void>}
 */
const forkToCohort = (repoPath, cohort, challengeName) => async (eff) => {
  const { SPORK_USE_FS_CP } = eff.env()
  if (SPORK_USE_FS_CP) {
    return forkToCohortCopy(repoPath, cohort, challengeName)(eff)
  }

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

  await setBranchProtection(cohort, challengeName)(eff)
}

export default forkToCohort
