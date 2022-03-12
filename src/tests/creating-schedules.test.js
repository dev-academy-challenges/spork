const main = require('../main')
const APP_NAME = require('../app-name')
const fakeInfra = require('../infra/fake')

describe('creating schedules', () => {
  it('throws unless the correct parameters are provided', async () => {
    const infra = { ...fakeInfra() }
    let err
    try {
      await main('--create-schedule')(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeUndefined()
  })

  it('produces js', async () => {
    const infra = { ...fakeInfra() }

    await main(
      '--create-schedule',
      '--cohort-org',
      'my-cohort',
      '--campus',
      'welly',
      '--start-date',
      '2022-03-14'
    )(infra)

    expect(infra.fsWrite).toBeCalledWith(
      `/~/.${APP_NAME}/schedule.js`,
      expect.any(String),
      'utf8'
    )
  })

  it('throws for invalid campus', async () => {
    const infra = { ...fakeInfra() }

    let err
    try {
      await main(
        '--create-schedule',
        '--cohort-org',
        'my-cohort',
        '--campus',
        'narnia',
        '--start-date',
        '2022-03-14'
      )(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeUndefined()

    expect(infra.fsWrite).not.toBeCalledWith(
      `/~/.${APP_NAME}/schedule.js`,
      expect.any(String),
      'utf8'
    )
  })

  it('throws for invalid dates', async () => {
    const infra = { ...fakeInfra() }

    let err
    try {
      await main(
        '--create-schedule',
        '--cohort-org',
        'my-cohort',
        '--campus',
        'welly',
        '--start-date',
        'whenever'
      )(infra)
    } catch (e) {
      err = e
    }

    expect(err).not.toBeUndefined()

    expect(infra.fsWrite).not.toBeCalledWith(
      `/~/.${APP_NAME}/schedule.js`,
      expect.any(String),
      'utf8'
    )
  })

  it(`won't overwrite existing schedule (without --overwrite)`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: (path) => path === `/~/.${APP_NAME}/schedule.js`,
    }

    await main(
      '--create-schedule',
      '--cohort-org',
      'my-cohort',
      '--campus',
      'welly',
      '--start-date',
      '2022-03-14'
    )(infra)

    expect(infra.writeStdout).toBeCalledWith(
      expect.stringMatching(/File exists at .*, not overwriting/)
    )

    expect(infra.fsWrite).not.toBeCalledWith(
      `/~/.${APP_NAME}/schedule.js`,
      expect.any(String),
      'utf8'
    )
  })

  it(`will overwrite existing schedule (with --overwrite)`, async () => {
    const infra = {
      ...fakeInfra(),
      fsExists: (path) => path === `/~/.${APP_NAME}/schedule.js`,
    }

    await main(
      '--create-schedule',
      '--cohort-org',
      'my-cohort',
      '--campus',
      'welly',
      '--start-date',
      '2022-03-14',
      '--overwrite'
    )(infra)

    expect(infra.writeStdout).not.toBeCalledWith(
      expect.stringMatching(/File exists at .*, not overwriting/)
    )

    expect(infra.fsWrite).toBeCalledWith(
      `/~/.${APP_NAME}/schedule.js`,
      expect.any(String),
      'utf8'
    )
  })
})
