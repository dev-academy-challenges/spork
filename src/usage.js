module.exports = `usage: sosij <options>

Deploy EDA challenges to their cohort orgs on a schedule

sosij uses the directory ~/.sosij (this path can be set by
the environment variable SOSIJ_DIRECTORY)

- ~/.sosij/monorepo-trial: a clone of the challenges monorepo
- ~/.sosij/env: environment variables will be read from this
  file if it exists

sosij expects these environment variables to be defined:

- GITHUB_USER
- GITHUB_ACCESS_TOKEN

OPTIONS:

 -h / --help:     display this message and exit
 -v / --version:  show the sosij version

 --init:          set up and exit without executing a schedule

 -s / --schedule: choose a schedule to execute actions from
 -d / --for-date: execute scheduled actions for this day
 --dry-run:       don't execute actions, just log that you would have
`
