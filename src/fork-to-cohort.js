import * as Path from 'node:path/posix'
import { createRepo, setBranchProtection } from './github.js'
import forward from './forward.js'
import readTilEnd from './read-til-end.js'

/**
 * @param {string} repoPath
 * @param {string} cohort
 * @param {string} challengeName
 * @returns {import('./infra/Infra.js').Eff<void>}
 */
const forkToCohort = (repoPath, cohort, challengeName) => async (eff) => {
  const pathToSubtree = Path.join(repoPath, 'packages', challengeName)
  if (!eff.fsExists(pathToSubtree)) {
    throw new Error(`${challengeName} doesn't exist in monorepo`)
  }

  const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = eff.env()
  const url = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/${cohort}/${challengeName}.git`

  await createRepo(cohort, challengeName)(eff)

  const lsTree = eff.spawn(repoPath, 'git', [
    'ls-tree',
    'main',
    `packages/${challengeName}`,
    '--object-only',
  ])
  const treeId = await readTilEnd(lsTree.stdout)

  const commitTree = eff.spawn(repoPath, 'git', [
    'commit-tree',
    '-m',
    'Sporked',
    `${treeId.trim()}`,
  ])

  const id = await readTilEnd(commitTree.stdout)

  await forward(
    eff.spawn(repoPath, `git`, ['push', url, `${id.trim()}:refs/heads/main`]),
    eff
  )

  await setBranchProtection(cohort, challengeName)(eff)
}

export default forkToCohort
