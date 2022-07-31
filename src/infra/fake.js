/**
 * @return {import('./Infra').IInfra}
 */
const fakeInfra = () => ({
  writeStdout: jest.fn(),
  env: () => ({ GITHUB_USER: 'me', GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
  spawn: jest.fn(async () => {}),
  cwd: () => '/',
  fsExists: () => false,
  fsMkDir: jest.fn(async () => {}),
  fsWrite: jest.fn(async () => {}),
  // @ts-ignore
  fsReadFile: jest.fn(async () => Buffer.from('')),
  require: jest.fn(() => () => {}),
  newDate: (...args) =>
    // @ts-ignore
    args.length === 0 ? new Date(448502400000) : new Date(...args),
  version: () => '1.0.0',
  post: jest.fn(async () => {}),
})

export default fakeInfra
