```
                               888
                               888
                               888
.d8888b 88888b.  .d88b. 888d888888  888
88K     888 "88bd88""88b888P"  888 .88P
"Y8888b.888  888888  888888    888888K
     X88888 d88PY88..88P888    888 "88b
 88888P'88888P"  "Y88P" 888    888  888
        888
        888
        888
```

`spork` is a cli tool to push challenges into cohort orgs on a schedule

# Quickstart Guide

Install spork directly from github with this npm command

```sh
npm install -g https://github.com/dev-academy-challenges/spork.git
```

> **Note:** this installs two commands `spork` and `publish-challenges` that
> behave identically, this documentation will use `spork` in all examples, but you
> can also use `publish-challenges` wherever you use spork.

Run this command to
create the `~/.spork` directory

```sh
spork --init
```

[Create a new Github Access Token](https://github.com/settings/tokens) with
`repo` permissions (I call mine "spork") then add your `GITHUB_USER` and
`GITHUB_ACCESS_TOKEN` to the `~/.spork/env` file.

```sh
code ~/.spork/env
```
> **Note:** don't forget to umcomment `GITHUB_USER` and `GITHUB_ACCESS_TOKEN`
> by removing the '#'

`spork` can bootstrap a schedule for you with a command like this.

You'll need to substitute the correct values for `cohort-org`, `start-date` and `campus`.

The names of the campusses are `welly`, `akl`, and `online`.

```sh
spork --create-schedule \
  --cohort-org piwakawaka-2022 \
  --start-date 2022-03-14 \
  --campus welly
```

This writes to `~/.spork/schedule.js` by default, so if that file exists you'll
need to delete it first or use the `--overwrite` flag. For example if you're
starting a new cohort you'll probably want to replace the previous schedule with
a new one.

Run this to inspect the schedule for mistakes.

```sh
code ~/.spork/schedule.js
```

Now you are ready to run a schedule. If you run this `spork` will determine
which repos would be deployed and log them out **but it does not deploy them**:

```sh
spork -d tomorrow --dry-run
```

If the output looks correct to you, run the command again without `--dry-run`:

```sh
spork -d tomorrow
```

Those two commands should be the majority of how you interact with spork, the
other common scenario is running it for a specific date (maybe deploying on a
Friday for the Monday).

```sh
spork -d 2022-04-05 # deploying challenges for the 5th of April
```

... or if you're deploying for today.

```sh
spork -d today
```

That should be everything you need for day-to-day use of spork.

# Refreshing recently-updated challenges

Spork gets the challenges from [monorepo-trial](https://github.com/dev-academy-challenges/monorepo-trial), so if a challenge gets updated in [dev-academy-challenges](https://github.com/dev-academy-challenges) you need to refresh monorepo-trial with the latest version of the challenge before using spork to push the challenge to a cohort org.

First clone down [monorepo-trial](https://github.com/dev-academy-challenges/monorepo-trial) if you haven't already. Then from the `main` branch of your local copy of monorepo-trial:

```sh
git pull
git subtree pull --prefix=packages/$CHALLENGE_NAME git@github.com:dev-academy-challenges/$CHALLENGE_NAME main
git push origin main
```

e.g.

```sh
git subtree pull --prefix=packages/lightning-talks git@github.com:dev-academy-challenges/lightning-talks main
```

Or reach out to [me](gerard.paapu@devacademy.co.nz) and I'll do it.

# Schedule files

Schedule files are javascript files that export a function like this:

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

It should take the `on` function as its only parameter and call it in this pattern:

```javascript
on(dateString)
  .deploy(...challenges)
  .to(cohortOrg)
```

These are required as regular node modules, so you can do more or less anything
you like in them.

- add comments
- require() other schedules into some kind of super schedule
- include or exclude challenges based on environment variables
- log things

This also means you should only run schedules that you trust.

# Running schedules

Running spork with a `-d`/`--for-date` parameter will try to run a schedule. The
parameter should be "today", "tomorrow" or a date string in the `YYYY-MM-DD`
format

```sh
spork --for-date tomorrow
spork -d tomorrow
spork --for-date today
spork -d today
spork --for-date 2022-05-01 # YYYY-MM-DD format
spork -d 2022-05-01
```

By default spork looks for `~/.spork/schedule.js` unless you pass a path with `-s`/`--schedule`

```sh
spork -d tomorrow -s ./my-schedule.js
spork -d tomorrow --schedule ./my-schedule.js
```

The cautious thing to do when running a schedule is to try it first with `--dry-run`

```sh
spork -d tomorrow -s ./my-schedule.js --dry-run
spork -d tomorrow --dry-run
```

This will update your local copy of the monorepo and decide based on the
schedule what needs to be deployed, but it will not deploy anything.

# Creating schedules from the template

spork has a template internally that it uses to bootstrap schedules.

spork will generate a schedule when passed the `--create-schedule` flag.

```javascript
spork --create-schedule \
  --cohort-org piwakawaka-2022 \
  --start-date 2022-03-14 \
  --campus welly
  --schedule ./example-schedule.js
```

The valid campus names are: `welly`, `akl` and `online`

spork uses these internally to include the correct challenges.

Unfortunately the [template](https://github.com/dev-academy-challenges/spork/blob/main/src/schedules/template.js) is not very readable code.

**NB: You don't have to learn this weird little language if you find a problem with your schedule, just hit [me](gerard.paapu@devacademy.co.nz) up and I will fix it. This is documented for the curious or masochistic.**

The template is a function that takes one parameter `w` (I promise I'll eventually make this nicer), which has all the methods we use to build a schedule.

- `w.schedule(...events)` takes any number of events and returns the schedule
- `w.on(week, day, campusPattern, action)` creates an event
- `w.week(number)` creates a week, the weeks are numbered from the start of a cohort so that `1` is the first week
- `w.mon()`, `w.tue()`, `w.wed()`, `w.thu()` and `w.fri()` create the days of the working week
- `w.all()` is a campus pattern that matches any campus
- `w.welly()` is a campus pattern that matches `'welly'`, `w.akl()` matches `'akl'` and `w.online()` matches `'online'`
- `w.except(...patterns)` is a campus pattern that matches any campus that isn't matched by `patterns`
- `w.deploy(...challenges)` creates an action that deploys the named challenges

So this is an example that will deploy `hotdog-machine` on Week 4 Monday for everyone

```javascript
w.on(w.week(4), w.mon(), w.all(), w.deploy('hotdog-machine')),
```

... but if only Auckland use `hotdog-machine`, we would write it like this:

```javascript
w.on(w.week(4), w.mon(), w.akl(), w.deploy('hotdog-machine')),
```

... actually it turns out that online like hotdogs too, so we would write this
instead. We're using `w.except(...)` to exclude Wellington and adding another
challenge that they use instead.

```javascript
w.on(w.week(4), w.mon(), w.except(w.welly()), w.deploy('hotdog-machine')),
w.on(w.week(4), w.mon(), w.welly(), w.deploy('vegan-hotdog-alternative-machine')),
```
# If you need to update the template

If you need to update the base template (so that your changes apply for all future cohorts), it's at `/src/schedules/template.js` 
* Make your changes in a branch 
* Don't forget `npx prettier --write foldername`
* Do `npm version patch` to increment the version number
* Then make a PR and send it to Gerard to review
