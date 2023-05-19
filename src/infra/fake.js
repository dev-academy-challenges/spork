import { PassThrough } from 'stream'

/**
 * @return {import('./Infra').IInfra}
 */
const fakeInfra = () => {
  const stdout = new PassThrough()
  const stderr = new PassThrough()

  const infra = {
    env: () => ({ GITHUB_USER: 'me', GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
    spawn: jest.fn(async () => {}),
    cwd: () => '/',
    fsExists: () => false,
    fsMkDir: jest.fn(async () => {}),
    fsWrite: jest.fn(async () => {}),
    // @ts-ignore
    fsReadFile: jest.fn(async () => Buffer.from('')),
    fsCp: jest.fn(async () => {}),
    import: jest.fn(async () => () => {}),
    newDate: (/** @type {any[]} */ ...args) =>
      // @ts-ignore
      args.length === 0 ? new Date(448502400000) : new Date(...args),
    request: jest.fn(async () => {}),
    stdout,
    stderr,
  }

  // @ts-ignore
  return infra
}

export default fakeInfra
