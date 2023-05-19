import * as Path from 'node:path/posix'
import { createRepo, setBranchProtection } from './github.js'
import PROGRAM_NAME from './app-name.js'

/**
 * @param {string} challengeName
 * @param {string} cohort
 * @return {import('./infra/Infra.js').Eff<void>}
 */
export default (challengeName, cohort) =>
  async (eff) => {
    const env = eff.env()
    eff.stdout.write(`Creating a repo for ${challengeName}\n`)
    const SPORK_DIRECTORY = Path.resolve(
      eff.cwd(),
      env.SPORK_DIRECTORY || `${env.HOME}/.${PROGRAM_NAME}`
    )
    const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = eff.env()
    const url = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/${cohort}/${challengeName}.git`
  
    const challengesPath = Path.join(SPORK_DIRECTORY, 'repos', 'challenges')
    const challengePath = Path.join(challengesPath, 'packages', challengeName)
    const workingDir = Path.join(eff.cwd(), challengeName)

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
    console.log({ url })
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
