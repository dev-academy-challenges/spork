const main = require('../main')
const APP_NAME = require('../app-name')
const fakeInfra = require('../infra/fake')

describe('Startup', () => {
  it('throws on invalid flags', async () => {
    const infra = {
      ...fakeInfra(),
    }

    let err
    try {
      await main('--invalid-flag')(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeUndefined()
  })

  it('logs startup message immediately', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main()(infra)
    expect(infra.writeStdout).toBeCalledWith(`${APP_NAME} running...\n`)
  })

  it('exits early with --help', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('--help')(infra)

    expect(infra.writeStdout).toBeCalled()
    expect(infra.spawn).not.toBeCalled()
    expect(infra.createRepo).not.toBeCalled()
  })

  it('exits early with -h', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('-h')(infra)

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

  it('exits early with -v', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('-v')(infra)

    expect(infra.writeStdout).toBeCalledWith(`${APP_NAME} v1.0.0\n`)
    expect(infra.spawn).not.toBeCalled()
    expect(infra.createRepo).not.toBeCalled()
  })

  it('exits eartly with --init', async () => {
    const infra = {
      ...fakeInfra(),
    }

    await main('--init')(infra)

    expect(infra.writeStdout).toBeCalledWith(
      expect.stringMatching(/called with --init/)
    )
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