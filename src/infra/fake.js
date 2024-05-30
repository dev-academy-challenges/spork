import { PassThrough } from 'stream'
import { vi } from 'vitest'

/**
 * @return {import('./Infra').IInfra}
 */
const fakeInfra = () => {
  const stdout = new PassThrough()
  const stderr = new PassThrough()

  const infra = {
    env: () => ({ GITHUB_USER: 'me', GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
    spawn: vi.fn(async () => {}),
    exec: vi.fn(async () => {
      return 'stdout'
    }),
    cwd: () => '/',
    fsExists: () => false,
    fsMkDir: vi.fn(async () => {}),
    fsMkDTemp: vi.fn(async (prefix) => {
      return `${prefix}1234`
    }),
    tmpDir: vi.fn(() => '/tmp'),
    fsWrite: vi.fn(async () => {}),
    // @ts-ignore
    fsReadFile: vi.fn(async () => Buffer.from('')),
    fsCp: vi.fn(async () => {}),
    import: vi.fn(async () => () => {}),
    newDate: (/** @type {any[]} */ ...args) =>
      // @ts-ignore
      args.length === 0 ? new Date(448502400000) : new Date(...args),
    request: vi.fn(async () => {}),
    stdout,
    stderr,
  }

  // @ts-ignore
  return infra
}

export default fakeInfra
