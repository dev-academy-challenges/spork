import { vi, describe, it, expect } from 'vitest'
import main from '../main.js'
import APP_NAME from '../app-name.js'
import fakeInfra from '../infra/fake.js'

describe('make local fork', () => {
  it(`doesn't call the schedule`, async () => {
    const schedule = vi.fn()
    const infra = {
      ...fakeInfra(),
      import: vi.fn(async () => ({ default: schedule })),
      fsExists: (/** @type {string} */ path) =>
        path === `/~/.${APP_NAME}/schedule.js`,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.import).not.toHaveBeenCalledWith(`/~/.${APP_NAME}/schedule.js`)
    expect(schedule).not.toHaveBeenCalled()
  })

  it(`creates a split and deletes it`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
      'git',
      ['subtree', 'split', `--prefix=packages/example`, '-b', `example-split`],
      {}
    )
  })

  it(`clones from a split branch`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.spawn).toHaveBeenCalledWith(
      '/',
      'git',
      [
        'clone',
        `/~/.${APP_NAME}/repos/challenges`,
        '--branch',
        `example-split`,
        'example',
      ],
      {}
    )
  })

  it(`deletes the branch it created`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
      'git',
      ['branch', '-D', `example-split`],
      {}
    )
  })

  it(`renames the split branch in the clone to "main"`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.spawn).toHaveBeenCalledWith(
      '/example',
      'git',
      ['branch', '-m', `main`],
      {}
    )
  })
})
