// const APP_NAME = require('./app-name')
import APP_NAME from './app-name.js'

export default `usage: ${APP_NAME} <options>

Deploy EDA challenges to their cohort orgs on a schedule

${APP_NAME} uses the directory ~/.${APP_NAME} (this path can be set by
the environment variable ${APP_NAME.toUpperCase()}_DIRECTORY)

- ~/.${APP_NAME}/monorepo-trial: a clone of the challenges monorepo
- ~/.${APP_NAME}/env: environment variables will be read from this
  file if it exists

${APP_NAME} expects these environment variables to be defined:

- GITHUB_USER
- GITHUB_ACCESS_TOKEN

OPTIONS:

 -h / --help:     display this message and exit
 -v / --version:  show the ${APP_NAME} version

 --init:          set up and exit without executing a schedule

 -s / --schedule: choose a schedule to execute actions from
 -d / --for-date: execute scheduled actions for this day
 --dry-run:       don't execute actions, just log that you would have
`
