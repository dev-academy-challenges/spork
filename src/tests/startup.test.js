import main from '../main.js'
import APP_NAME from '../app-name.js'
import version from '../app-version.js'
import fakeInfra from '../infra/fake.js'
import { readTilEnd } from './utils'
import { vi, describe, it, expect } from 'vitest'

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

    expect(err).toBeDefined()
  })

  it('logs startup message immediately', async () => {
    const infra = fakeInfra()

    await main()(infra)
    const output = await readTilEnd(infra.stdout)

    expect(output).toContain(`${APP_NAME} running...\n`)
  })

  it('exits early with --help', async () => {
    const infra = fakeInfra()

    await main('--help')(infra)
    const output = await readTilEnd(infra.stdout)

    expect(output).not.toBe('')
    expect(infra.spawn).not.toHaveBeenCalled()
    expect(infra.request).not.toHaveBeenCalled()
  })

  it('exits early with -h', async () => {
    const infra = fakeInfra()

    await main('-h')(infra)
    const output = await readTilEnd(infra.stdout)
    expect(output).not.toBe('')
    expect(infra.spawn).not.toHaveBeenCalled()
    expect(infra.request).not.toHaveBeenCalled()
  })

  it('exits early with --version', async () => {
    const infra = fakeInfra()

    await main('--version')(infra)
    const output = await readTilEnd(infra.stdout)

    expect(output).toBe(`${APP_NAME} v${version}\n`)
    expect(infra.spawn).not.toHaveBeenCalled()
    expect(infra.request).not.toHaveBeenCalled()
  })

  it('exits early with -v', async () => {
    const infra = fakeInfra()

    await main('-v')(infra)
    const output = await readTilEnd(infra.stdout)
    expect(output).toBe(`${APP_NAME} v${version}\n`)
    expect(infra.spawn).not.toHaveBeenCalled()
    expect(infra.request).not.toHaveBeenCalled()
  })

  it('exits eartly with --init', async () => {
    const infra = fakeInfra()

    await main('--init')(infra)
    const output = await readTilEnd(infra.stdout)

    expect(output).toEqual(expect.stringMatching(/called with --init/))
    expect(infra.spawn).not.toHaveBeenCalled()
    expect(infra.request).not.toHaveBeenCalled()
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
    // @ts-ignore
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
    // @ts-ignore
    expect(err.message).toMatch(/GITHUB_ACCESS_TOKEN is undefined/)
  })

  it('creates a home directory if none exists', async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => false,
    }

    await main()(infra)

    expect(infra.fsMkDir).toHaveBeenCalledWith(`/~/.${APP_NAME}`)
    expect(infra.fsWrite).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/env`,
      expect.anything()
    )
  })

  it(`doesn't create a home directory if one exists`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
      import: vi.fn(async () => ({ default: () => {} })),
    }

    await main()(infra)

    expect(infra.fsMkDir).not.toHaveBeenCalledWith('/~/.${APP_NAME}')
  })

  it(`clones the monorepo if the directory doesn't exist`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => false,
    }

    await main()(infra)

    expect(infra.spawn).toHaveBeenCalledWith(
      expect.any(String),
      'git',
      ['clone', expect.any(String), `/~/.${APP_NAME}/repos/challenges`],
      { secret: '_' }
    )
  })

  it(`pulls from origin if the monorepo directory exists`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
      import: vi.fn(async () => ({ default: () => {} })),
    }

    await main()(infra)
    const output = await readTilEnd(infra.stdout)

    expect(output).toEqual(
      expect.stringMatching(/Monorepo exists at (.*) updating\n/)
    )

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
      'git',
      [
        'pull',
        'https://me:_@github.com/dev-academy-challenges/challenges',
        'main:main',
      ],
      { secret: '_' }
    )
  })

  it(`loads a schedule if provided`, async () => {
    const infra = {
      ...fakeInfra(),
      import: vi.fn(async () => ({ default: () => {} })),
    }

    await main('-s', '~/schedule.js')(infra)

    expect(infra.import).toHaveBeenCalledWith('/~/schedule.js')
  })
})
