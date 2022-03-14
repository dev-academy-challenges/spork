```
                        d8b  d8b
                        Y8P  Y8P

.d8888b  .d88b. .d8888b 888 8888
88K     d88""88b88K     888 "888
"Y8888b.888  888"Y8888b.888  888
     X88Y88..88P     X88888  888
 88888P' "Y88P"  88888P'888  888
                             888
                            d88P
                          888P"
```

`sosij` is an experimental cli tool to push challenges into cohort orgs on a schedule

### Quickstart Guide

sosij creates a directory at `~/.sosij` (this is configurable), so this is the
fastest way to get set up.

sosij expects `GITHUB_USER` and `GITHUB_ACCESS_TOKEN` to be in the environment,
it will load variables from `~/.sosij/env`.

```sh
$ npm install -g https://github.com/dev-academy-challenges/sosij.git
$ sosij --init
$ code ~/.sosij/env
```

### Running a schedule

sosij will look for `~/.sosij/schedule.js` unless you pass `-s path/to/schedule.js` or `--schedule path/to/schedule.js`

You need to pass a date in `--for-date=YYYY-MM-DD` format, and it will deploy challenges intended for exactly that day

We also support `--for-date=today` and `--for-date=tomorrow`. `sosij -d today` or `sosij -d tomorrow` is your friend (once a schedule is setup).

A schedule should look like this:

```javascript
module.exports = (on) => {
  on('2022-04-14')
    .deploy('two-truths-and-a-lie', 'objects-and-arrays-kata')
    .to('piwakawaka-2022')

  on('2022-03-15')
    .deploy(
      'kata-types-modules',
      'kata-strings-numbers-modules',
      'exercise-arrays',
      'object-array-practice',
      'kata-number-patterns'
    )
    .to('piwakawaka-2022')
}
```

If you want to see what would be deployed, but not actually run deployment use the `--dry-run` flag

### Generating a schedule

This is a place to start but is missing some of the campus specific challenges.

Valid values for campus are `welly`, `akl` and `online`

```sh
$ sosij --create-schedule \
  --cohort-org piwakawaka-2022 \
  --start-date 2022-03-14 \
  --campus welly \
  --schedule ~/welly-term2-schedule.js
```
