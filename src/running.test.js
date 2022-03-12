const main = require('./main')
const Path = require('path/posix')
const APP_NAME = require('./app-name')

const fakeInfra = () => ({
  writeStdout: jest.fn(),
  env: () => ({ GITHUB_USER: 'me', GITHUB_ACCESS_TOKEN: '_', HOME: '~' }),
  spawn: jest.fn(async () => null),
  cwd: () => '/cwd',
  fsExists: () => false,
  fsMkDir: jest.fn(async () => null),
  fsWrite: jest.fn(async () => null),
  fsReadFile: jest.fn(async () => Buffer.from('')),
  joinPath: (...args) => Path.join(...args),
  resolvePath: (...args) => Path.join(...args),
  require: jest.fn(() => () => {}),
  run: () => {},
  newDate: (...args) =>
    args.length === 0 ? new Date(448502400000) : new Date(...args),
  version: () => '1.0.0',
  createRepo: jest.fn(async () => null),
})

describe('running schedules', () => {
  it('calls the schedule', async () => {
    const schedule = jest.fn()
    const infra = {
      ...fakeInfra(),
      require: jest.fn(() => schedule),
      fsExists: (path) => path === `~/.${APP_NAME}/schedule.js`,
    }

    await main()(infra)

    expect(infra.require).toBeCalledWith(`~/.${APP_NAME}/schedule`)
    expect(schedule).toBeCalled()
  })

  it('calls the schedule', async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14').deploy('todays-challenge').to('my-cohort-org')
      on('2022-03-15').deploy('tomorrows-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: () => true, // the packages must exist in the monorepo
      require: jest.fn(() => schedule),
    }

    await main('-d', '2022-03-14')(infra)

    expect(infra.require).toBeCalledWith(`~/.${APP_NAME}/schedule`)
    expect(infra.createRepo).toBeCalledWith('my-cohort-org', 'todays-challenge')
    expect(infra.createRepo).not.toBeCalledWith(
      'my-cohort-org',
      'tomorrows-challenge'
    )
    expect(infra.spawn).toBeCalledWith(`~/.${APP_NAME}/monorepo-trial`, 'git', [
      'subtree',
      'push',
      `--prefix=packages/todays-challenge`,
      `https://me:_@github.com/my-cohort-org/todays-challenge.git`,
      'main',
    ])
    expect(schedule).toBeCalled()
  })

  it(`deploys today's challenge with "--for-date today"`, async () => {
    const schedule = jest.fn((on) => {
      on('1984-03-19').deploy('birthday-challenge').to('my-cohort-org')
      on('1984-03-20').deploy('just-some-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: () => true, // the packages must exist in the monorepo
      require: jest.fn(() => schedule),
    }

    await main('-d', 'today')(infra)

    expect(infra.require).toBeCalledWith(`~/.${APP_NAME}/schedule`)
    expect(infra.createRepo).toBeCalledWith(
      'my-cohort-org',
      'birthday-challenge'
    )
    expect(infra.createRepo).not.toBeCalledWith(
      'my-cohort-org',
      'just-some-challenge'
    )
    expect(infra.spawn).toBeCalledWith(`~/.${APP_NAME}/monorepo-trial`, 'git', [
      'subtree',
      'push',
      `--prefix=packages/birthday-challenge`,
      `https://me:_@github.com/my-cohort-org/birthday-challenge.git`,
      'main',
    ])
    expect(schedule).toBeCalled()
  })

  it(`deploys tomorrows challenge with "--for-date tomorrow"`, async () => {
    const schedule = jest.fn((on) => {
      on('1984-03-19').deploy('birthday-challenge').to('my-cohort-org')
      on('1984-03-20').deploy('just-some-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: () => true, // the packages must exist in the monorepo
      require: jest.fn(() => schedule),
    }

    await main('-d', 'tomorrow')(infra)

    expect(infra.require).toBeCalledWith(`~/.${APP_NAME}/schedule`)
    expect(infra.createRepo).not.toBeCalledWith(
      'my-cohort-org',
      'birthday-challenge'
    )
    expect(infra.createRepo).toBeCalledWith(
      'my-cohort-org',
      'just-some-challenge'
    )
    expect(infra.spawn).toBeCalledWith(`~/.${APP_NAME}/monorepo-trial`, 'git', [
      'subtree',
      'push',
      `--prefix=packages/just-some-challenge`,
      `https://me:_@github.com/my-cohort-org/just-some-challenge.git`,
      'main',
    ])
    expect(schedule).toBeCalled()
  })

  it(`uses the credentials from ~/.${APP_NAME}/env`, async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14').deploy('todays-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: () => true, // the packages must exist in the monorepo
      env: () => ({ HOME: '~' }),
      fsReadFile: async (path) => {
        if (path === `~/.${APP_NAME}/env`) {
          return Buffer.from(`#!/usr/bin/env bash

GITHUB_USER=peter
GITHUB_ACCESS_TOKEN=gh_peters_token\n`)
        }

        return Buffer.from('')
      },
      require: jest.fn(() => schedule),
    }

    await main('-d', '2022-03-14')(infra)

    expect(infra.spawn).toBeCalledWith(`~/.${APP_NAME}/monorepo-trial`, 'git', [
      'subtree',
      'push',
      `--prefix=packages/todays-challenge`,
      `https://peter:gh_peters_token@github.com/my-cohort-org/todays-challenge.git`,
      'main',
    ])
  })
})
