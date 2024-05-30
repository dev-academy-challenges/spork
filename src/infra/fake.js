import { PassThrough, Readable, Writable } from 'stream'
import { vi } from 'vitest'

/**
 * @return {import('./Infra').IInfra}
 */
const fakeInfra = () => {
  const stdout = new PassThrough()
  const stderr = new PassThrough()

  const infra = {
    env: () => ({ GITHUB_USER: 'me', GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
    spawn: vi.fn((_, cmd, [subcmd]) => {
      const stdout = new Readable({
        read() {},
      })
      stdout.push(`__${cmd}_${subcmd}__`)
      stdout.push(null)

      const stderr = new Readable({
        read() {},
      })
      stderr.push(`__${cmd}_${subcmd}_err__`)
      stderr.push(null)

      const stdin = new Writable({
        write(_, __, cb) {
          cb()
        },
      })
      const exit = Promise.resolve(0)

      return { stdout, stderr, stdin, exit }
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
