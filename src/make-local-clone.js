import * as Path from 'node:path/posix'
import PROGRAM_NAME from './app-name.js'

/**
 * @param {string} challenge
 * @return {import('./infra/Infra').Eff<void>}
 */
export default (challenge, branch = 'main') =>
  async (eff) => {
    const env = eff.env()
    eff.stdout.write(`Making a local clone of ${challenge}\n`)
    const SPORK_DIRECTORY = Path.resolve(
      eff.cwd(),
      env.SPORK_DIRECTORY || `${env.HOME}/.${PROGRAM_NAME}`
    )
    const challengesPath = Path.join(SPORK_DIRECTORY, 'repos', 'challenges')
    try {
      if (branch !== 'main') {
        const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = env
        const MONOREPO_URL = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/dev-academy-challenges/challenges`
        await eff.spawn(challengesPath, 'git', ['fetch', MONOREPO_URL], {})
        await eff.spawn(challengesPath, 'git', ['checkout', branch], {})
        await eff.spawn(challengesPath, 'git', [
          'pull',
          'origin',
          `${branch}:${branch}`,
        ])
      }

      await eff.spawn(
        challengesPath,
        'git',
        [
          'subtree',
          'split',
          `--prefix=packages/${challenge}`,
          '-b',
          `${challenge}-split`,
        ],
        {}
      )

      await eff.spawn(
        eff.cwd(),
        'git',
        [
          'clone',
          challengesPath,
          `--branch`,
          `${challenge}-split`,
          `${challenge}`,
        ],
        {}
      )

      await eff.spawn(
        challengesPath,
        'git',
        ['branch', '-D', `${challenge}-split`],
        {}
      )

      await eff.spawn(
        Path.join(eff.cwd(), challenge),
        'git',
        ['branch', '-m', `main`],
        {}
      )
    } finally {
      await eff.spawn(challengesPath, 'git', ['checkout', 'main'], {})
    }
  }
