const main = require('../main')
const APP_NAME = require('../app-name')
const fakeInfra = require('../infra/fake')

describe('running schedules', () => {
  it('calls the schedule', async () => {
    const schedule = jest.fn()
    const infra = {
      ...fakeInfra(),
      require: jest.fn(() => schedule),
      fsExists: (path) => path === `/~/.${APP_NAME}/schedule.js`,
    }

    await main()(infra)

    expect(infra.require).toBeCalledWith(`/~/.${APP_NAME}/schedule`)
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

    expect(infra.require).toBeCalledWith(`/~/.${APP_NAME}/schedule`)
    const basicAuth = Buffer.from('me:_').toString('base64')

    expect(infra.post).toBeCalledWith({
      hostname: 'api.github.com',
      path: `/orgs/my-cohort-org/repos`,
      port: 443,
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'fork-to-cohort',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'todays-challenge',
        visibility: 'internal',
      }),
    })

    expect(infra.post).not.toBeCalledWith({
      hostname: 'api.github.com',
      path: `/orgs/my-cohort-org/repos`,
      port: 443,
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'fork-to-cohort',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'tomorrows-challenge',
        visibility: 'internal',
      }),
    })

    expect(infra.spawn).toBeCalledWith(
      `/~/.${APP_NAME}/monorepo-trial`,
      'git',
      [
        'subtree',
        'push',
        `--prefix=packages/todays-challenge`,
        `https://me:_@github.com/my-cohort-org/todays-challenge.git`,
        'main',
      ],
      { secret: '_' }
    )
    expect(schedule).toBeCalled()
  })

  it(`bails out if the named challenge doesn't exist`, async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14').deploy('todays-challenge').to('my-cohort-org')
      on('2022-03-15').deploy('tomorrows-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: (path) =>
        // the package must not exist in the monorepo
        path !== `/~/.${APP_NAME}/monorepo-trial/packages/todays-challenge`,
      require: jest.fn(() => schedule),
    }

    let err
    try {
      await main('-d', '2022-03-14')(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeNull()
    expect(err.message).toMatch(/todays-challenge doesn't exist/)

    expect(infra.post).not.toBeCalled()
    expect(infra.spawn).not.toBeCalledWith(
      `/~/.${APP_NAME}/monorepo-trial`,
      'git',
      [
        'subtree',
        'push',
        `--prefix=packages/todays-challenge`,
        expect.any(String),
        'main',
      ],
      { secret: expect.any(String) }
    )
    expect(schedule).toBeCalled()
  })
  it('calls the schedule, in dry-run mode', async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14').deploy('todays-challenge').to('my-cohort-org')
      on('2022-03-15').deploy('tomorrows-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: () => true, // the packages must exist in the monorepo
      require: jest.fn(() => schedule),
    }

    await main('-d', '2022-03-14', '--dry-run')(infra)

    expect(infra.require).toBeCalledWith(`/~/.${APP_NAME}/schedule`)
    expect(infra.post).not.toBeCalled()
    expect(infra.spawn).not.toBeCalledWith(
      expect.any(String),
      'git',
      [
        'subtree',
        'push',
        expect.any(String),
        expect.any(String),
        expect.any(String),
      ],
      { secret: expect.any(String) }
    )
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

    expect(infra.require).toBeCalledWith(`/~/.${APP_NAME}/schedule`)
    const basicAuth = Buffer.from('me:_').toString('base64')

    expect(infra.post).toBeCalledWith({
      hostname: 'api.github.com',
      path: `/orgs/my-cohort-org/repos`,
      port: 443,
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'fork-to-cohort',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'birthday-challenge',
        visibility: 'internal',
      }),
    })

    expect(infra.post).not.toBeCalledWith({
      hostname: 'api.github.com',
      path: `/orgs/my-cohort-org/repos`,
      port: 443,
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'fork-to-cohort',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'just-some-challenge',
        visibility: 'internal',
      }),
    })

    expect(infra.spawn).toBeCalledWith(
      `/~/.${APP_NAME}/monorepo-trial`,
      'git',
      [
        'subtree',
        'push',
        `--prefix=packages/birthday-challenge`,
        `https://me:_@github.com/my-cohort-org/birthday-challenge.git`,
        'main',
      ],
      { secret: '_' }
    )
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

    expect(infra.require).toBeCalledWith(`/~/.${APP_NAME}/schedule`)
    const basicAuth = Buffer.from('me:_').toString('base64')
    expect(infra.post).not.toBeCalledWith({
      hostname: 'api.github.com',
      path: `/orgs/my-cohort-org/repos`,
      port: 443,
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'fork-to-cohort',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'birthday-challenge',
        visibility: 'internal',
      }),
    })

    expect(infra.post).toBeCalledWith({
      hostname: 'api.github.com',
      path: `/orgs/my-cohort-org/repos`,
      port: 443,
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'fork-to-cohort',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'just-some-challenge',
        visibility: 'internal',
      }),
    })
    expect(infra.spawn).toBeCalledWith(
      `/~/.${APP_NAME}/monorepo-trial`,
      'git',
      [
        'subtree',
        'push',
        `--prefix=packages/just-some-challenge`,
        `https://me:_@github.com/my-cohort-org/just-some-challenge.git`,
        'main',
      ],
      { secret: '_' }
    )
    expect(schedule).toBeCalled()
  })

  it(`uses the credentials from /~/.${APP_NAME}/env`, async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14').deploy('todays-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: () => true, // the packages must exist in the monorepo
      env: () => ({ HOME: '~' }),
      fsReadFile: async (path) => {
        if (path === `/~/.${APP_NAME}/env`) {
          return Buffer.from(`#!/usr/bin/env bash

GITHUB_USER=peter
GITHUB_ACCESS_TOKEN=gh_peters_token\n`)
        }

        return Buffer.from('')
      },
      require: jest.fn(() => schedule),
    }

    await main('-d', '2022-03-14')(infra)

    expect(infra.spawn).toBeCalledWith(
      `/~/.${APP_NAME}/monorepo-trial`,
      'git',
      [
        'subtree',
        'push',
        `--prefix=packages/todays-challenge`,
        `https://peter:gh_peters_token@github.com/my-cohort-org/todays-challenge.git`,
        'main',
      ],
      { secret: 'gh_peters_token' }
    )

    const basicAuth = Buffer.from('peter:gh_peters_token').toString('base64')
    expect(infra.post).toBeCalledWith({
      hostname: 'api.github.com',
      path: `/orgs/my-cohort-org/repos`,
      port: 443,
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'fork-to-cohort',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'todays-challenge',
        visibility: 'internal',
      }),
    })
  })
})
