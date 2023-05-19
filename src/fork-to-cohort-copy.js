import * as Path from 'node:path/posix'
import { createRepo, setBranchProtection } from './github.js'

/**
 * @param {string} repoPath
 * @param {string} challengeName
 * @param {string} cohort
 * @return {import('./infra/Infra.js').Eff<void>}
 */
export default (repoPath, challengeName, cohort) =>
  async (eff) => {
    eff.stdout.write(`Creating a repo for ${challengeName}\n`)
    const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = eff.env()
    const url = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/${cohort}/${challengeName}.git`
  
    const challengePath = Path.join(repoPath, 'packages', challengeName)
    const workingDir = await eff.fsMkDTemp(Path.join(eff.tmpDir(), 'spork-'))

    if (!eff.fsExists(challengePath)) {
      throw new Error(`${challengeName} doesn't exist`)
    }

    await eff.fsCp(challengePath, workingDir, { recursive: true })

    await eff.spawn(
      workingDir,
      'git', 
      ['init', '-q']
    )
    
    await eff.spawn(
      workingDir,
      'git', ['add', '-A', '.']
    )
    await eff.spawn(
      workingDir,
      'git', ['commit', '-a', '-m', 'Created git repo']
    )

    await createRepo(cohort, challengeName)(eff)
    await eff.spawn(
      workingDir,
      `git`,
      ['push', url, `main`],
      { secret: GITHUB_ACCESS_TOKEN }
    )

    try {
      await setBranchProtection(cohort, challengeName)(eff)
    } catch (e) {
      eff.stderr.write(`Failed to set branch protection: ${String(e)}\n`)
    }
  }
