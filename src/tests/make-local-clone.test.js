import { vi, describe, it, expect } from 'vitest'
import main from '../main.js'
import APP_NAME from '../app-name.js'
import fakeInfra from '../infra/fake.js'

describe('make local clone', () => {
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

  it(`gets the id for a tree object`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
      'git',
      ['ls-tree', 'main', 'packages/example', '--object-only']
    )
  })

  it(`creates a tar stream for that object`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
      'git',
      ['archive', '__git_ls-tree__']
    )
  })

  it(`extracts the tar stream to the right directory`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: () => true,
    }

    await main('--make-local-clone', 'example')(infra)

    expect(infra.spawn).toHaveBeenCalledWith('/', 'tar', [
      '-x',
      '-C',
      'example',
    ])
  })
})
