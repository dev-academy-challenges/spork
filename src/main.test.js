const main = require('./main')
const Path = require('path/posix')

const fakeInfra = () => ({
  writeStdout: jest.fn(),
  env: () => ({ GITHUB_USER: 'me', GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
  spawn: jest.fn(async () => null),
  cwd: () => '/cwd',
  fsExists: () => false,
  fsMkDir: jest.fn(async () => null),
  joinPath: (...args) => Path.join(...args),
  resolvePath: (...args) => Path.join(...args),
  require: jest.fn(() => () => {}),
  run: () => {},
  newDate: (...args) =>
    args.length === 0 ? new Date(448502400000) : new Date(...args),
})

describe('main', () => {
  it('logs startup message immediately', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main()(infra)
    expect(infra.writeStdout).toBeCalledWith(`sosij running...\n`)
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

    expect(infra.fsMkDir).toBeCalledWith('~/.sosij')
  })

  it(`doesn't create a home directory if one exists`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main()(infra)

    expect(infra.fsMkDir).not.toBeCalledWith('~/.sosij')
  })

  it(`clones the monorepo if the directory doesn't exist`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => false,
    }

    await main()(infra)

    expect(infra.spawn).toBeCalledWith('/cwd', 'git', [
      'clone',
      expect.any(String),
      expect.any(String),
    ])
  })

  it(`pulls from origin if the monorepo directory exists`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main()(infra)

    expect(infra.writeStdout).toBeCalledWith(`Monorepo exists, updating\n`)

    expect(infra.spawn).toBeCalledWith('~/.sosij/monorepo-trial', 'git', [
      'pull',
    ])
  })

  it(`loads a schedule if provided`, async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('-s', '~/schedule.js')(infra)

    expect(infra.require).toBeCalledWith('~/schedule')
  })
})
