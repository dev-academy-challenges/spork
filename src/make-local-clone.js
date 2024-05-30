import * as Path from 'node:path/posix'
import PROGRAM_NAME from './app-name.js'
import forward from './forward.js'
import readTilEnd from './read-til-end.js'

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
      env.SPORK_DIRECTORY ?? `${env.HOME}/.${PROGRAM_NAME}`
    )
    const challengesPath = Path.join(SPORK_DIRECTORY, 'repos', 'challenges')
    const { GITHUB_USER, GITHUB_ACCESS_TOKEN } = env
    const MONOREPO_URL = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@github.com/dev-academy-challenges/challenges`
    await forward(
      eff.spawn(challengesPath, 'git', ['pull', MONOREPO_URL], {}),
      eff
    )

    const lsTree = eff.spawn(challengesPath, 'git', [
      'ls-tree',
      branch,
      `packages/${challenge}`,
      '--object-only',
    ])

    const treeId = await readTilEnd(lsTree.stdout)
    await eff.fsMkDir(Path.join(eff.cwd(), challenge))
    const tar = eff.spawn(eff.cwd(), 'tar', ['-x', '-C', `${challenge}`])
    const archive = eff.spawn(challengesPath, 'git', [
      'archive',
      `${treeId.trim()}`,
    ])
    archive.stdout.pipe(tar.stdin)
    await forward(tar, eff)
  }
