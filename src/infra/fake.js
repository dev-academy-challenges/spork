const fakeInfra = () => ({
  writeStdout: jest.fn(),
  env: () => ({ GITHUB_USER: 'me', GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
  spawn: jest.fn(async () => null),
  cwd: () => '/',
  fsExists: () => false,
  fsMkDir: jest.fn(async () => null),
  fsWrite: jest.fn(async () => null),
  fsReadFile: jest.fn(async () => Buffer.from('')),
  require: jest.fn(() => () => {}),
  run: () => {},
  newDate: (...args) =>
    args.length === 0 ? new Date(448502400000) : new Date(...args),
  version: () => '1.0.0',
  post: jest.fn(async () => null),
})

module.exports = fakeInfra
