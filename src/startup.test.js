const main = require('./main')
const APP_NAME = require('./app-name')

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
  createRepo: jest.fn(async () => null),
})

describe('Startup', () => {
  it('logs startup message immediately', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main()(infra)
    expect(infra.writeStdout).toBeCalledWith(`${APP_NAME} running...\n`)
  })

  it('exists early with --help', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('--help')(infra)

    expect(infra.writeStdout).toBeCalled()
    expect(infra.spawn).not.toBeCalled()
    expect(infra.createRepo).not.toBeCalled()
  })

  it('exits early with --version', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('--version')(infra)

    expect(infra.writeStdout).toBeCalledWith(`${APP_NAME} v1.0.0\n`)
    expect(infra.spawn).not.toBeCalled()
    expect(infra.createRepo).not.toBeCalled()
  })

  it('exits early if GITHUB_USER is missing', async () => {
    const infra = {
      ...fakeInfra(),
      env: () => ({ GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
    }

    let err
    try {
      await main()(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeNull()
    expect(err.message).toMatch(/GITHUB_USER is undefined/)
  })

  it('exits early if GITHUB_ACCESS_TOKEN is missing', async () => {
    const infra = {
      ...fakeInfra(),
      env: () => ({ GITHUB_USER: '_', HOME: '~' }),
    }

    let err
    try {
      await main()(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeNull()
    expect(err.message).toMatch(/GITHUB_ACCESS_TOKEN is undefined/)
  })

  it('creates a home directory if none exists', async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => false,
    }

    await main()(infra)

    expect(infra.fsMkDir).toBeCalledWith(`/~/.${APP_NAME}`)
    expect(infra.fsWrite).toBeCalledWith(
      `/~/.${APP_NAME}/env`,
      expect.anything()
    )
  })

  it(`doesn't create a home directory if one exists`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main()(infra)

    expect(infra.fsMkDir).not.toBeCalledWith('/~/.${APP_NAME}')
  })

  it(`clones the monorepo if the directory doesn't exist`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => false,
    }

    await main()(infra)

    expect(infra.spawn).toBeCalledWith(expect.any(String), 'git', [
      'clone',
      expect.any(String),
      `/~/.${APP_NAME}/monorepo-trial`,
    ])
  })

  it(`pulls from origin if the monorepo directory exists`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main()(infra)

    expect(infra.writeStdout).toBeCalledWith(
      expect.stringMatching(/Monorepo exists at (.*) updating\n/)
    )

    expect(infra.spawn).toBeCalledWith(
      `/~/.${APP_NAME}/monorepo-trial`,
      'git',
      ['pull']
    )
  })

  it(`loads a schedule if provided`, async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('-s', '~/schedule.js')(infra)

    expect(infra.require).toBeCalledWith('/~/schedule')
  })
})
