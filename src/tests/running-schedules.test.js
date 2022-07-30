// const main = require('../main')
// const APP_NAME = require('../app-name')
// const fakeInfra = require('../infra/fake')
import main from '../main.js'
import APP_NAME from '../app-name.js'
import fakeInfra from '../infra/fake.js'
import jest from 'jest-mock'

describe('running schedules', () => {
  it('calls the schedule', async () => {
    const schedule = jest.fn()
    const infra = {
      ...fakeInfra(),
      require: jest.fn(() => schedule),
      fsExists: (path) => path === `/~/.${APP_NAME}/schedule.js`,
    }

    await main()(infra)

    expect(infra.require).toHaveBeenCalledWith(`/~/.${APP_NAME}/schedule`)
    expect(schedule).toHaveBeenCalled()
  })

  it('deploys todays challenge from the schedule', async () => {
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

    expect(infra.require).toHaveBeenCalledWith(`/~/.${APP_NAME}/schedule`)
    const basicAuth = Buffer.from('me:_').toString('base64')

    expect(infra.post).toHaveBeenCalledWith({
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

    expect(infra.post).not.toHaveBeenCalledWith({
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

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
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
    expect(schedule).toHaveBeenCalled()
  })

  it(`doesn't try to deploy a challenge that doesn't exist in the monorepo`, async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14').deploy('todays-challenge').to('my-cohort-org')
      on('2022-03-15').deploy('tomorrows-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: (path) =>
        // the package must not exist in the monorepo
        path !== `/~/.${APP_NAME}/repos/challenges/packages/todays-challenge`,
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

    expect(infra.post).not.toHaveBeenCalled()
    expect(infra.spawn).not.toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
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
    expect(schedule).toHaveBeenCalled()
  })

  it(`even --dry-run fails for a challenge that doesn't exist in the monorepo`, async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14').deploy('todays-challenge').to('my-cohort-org')
      on('2022-03-15').deploy('tomorrows-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: (path) =>
        // the package must not exist in the monorepo
        path !== `/~/.${APP_NAME}/repos/challenges/packages/todays-challenge`,
      require: jest.fn(() => schedule),
    }

    let err
    try {
      await main('-d', '2022-03-14', '--dry-run')(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeNull()
    expect(err.message).toMatch(/todays-challenge doesn't exist/)
  })

  it(`continues past failed deploys`, async () => {
    const schedule = jest.fn((on) => {
      on('2022-03-14')
        .deploy('todays-challenge-1', 'todays-challenge-2')
        .to('my-cohort-org')
      on('2022-03-15').deploy('tomorrows-challenge').to('my-cohort-org')
    })

    const infra = {
      ...fakeInfra(),
      fsExists: (path) =>
        // the 1st package must not exist in the monorepo
        path !== `/~/.${APP_NAME}/repos/challenges/packages/todays-challenge-1`,
      require: jest.fn(() => schedule),
    }

    let err
    try {
      await main('-d', '2022-03-14')(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeNull()
    expect(err.message).toMatch(/todays-challenge-1 doesn't exist/)
    expect(infra.post).toHaveBeenCalledTimes(1)
    expect(infra.post).toHaveBeenCalledWith({
      body: JSON.stringify({
        name: 'todays-challenge-2',
        visibility: 'internal',
      }),
      headers: {
        Authorization: 'Basic bWU6Xw==',
        'Content-Type': 'application/json',
        'User-Agent': 'fork-to-cohort',
      },
      hostname: 'api.github.com',
      method: 'POST',
      path: '/orgs/my-cohort-org/repos',
      port: 443,
    })

    expect(infra.spawn).not.toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
      'git',
      [
        'subtree',
        'push',
        `--prefix=packages/todays-challenge-1`,
        expect.any(String),
        'main',
      ],
      { secret: expect.any(String) }
    )
    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
      'git',
      [
        'subtree',
        'push',
        `--prefix=packages/todays-challenge-2`,
        expect.any(String),
        'main',
      ],
      { secret: expect.any(String) }
    )
    expect(schedule).toHaveBeenCalled()
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

    expect(infra.require).toHaveBeenCalledWith(`/~/.${APP_NAME}/schedule`)
    expect(infra.post).not.toHaveBeenCalled()
    expect(infra.spawn).not.toHaveBeenCalledWith(
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
    expect(schedule).toHaveBeenCalled()
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

    expect(infra.require).toHaveBeenCalledWith(`/~/.${APP_NAME}/schedule`)
    const basicAuth = Buffer.from('me:_').toString('base64')

    expect(infra.post).toHaveBeenCalledWith({
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

    expect(infra.post).not.toHaveBeenCalledWith({
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

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
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
    expect(schedule).toHaveBeenCalled()
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

    expect(infra.require).toHaveBeenCalledWith(`/~/.${APP_NAME}/schedule`)
    const basicAuth = Buffer.from('me:_').toString('base64')
    expect(infra.post).not.toHaveBeenCalledWith({
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

    expect(infra.post).toHaveBeenCalledWith({
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
    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
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
    expect(schedule).toHaveBeenCalled()
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

    expect(infra.spawn).toHaveBeenCalledWith(
      `/~/.${APP_NAME}/repos/challenges`,
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
    expect(infra.post).toHaveBeenCalledWith({
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
