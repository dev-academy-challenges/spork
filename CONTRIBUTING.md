# Contributing to sosij

## Features are expensive

Please raise an issue first if you think you want to add a feature.

We try to have as few features and options as is practical, and for features
that we do decide to include we should talk about the UX. A PR for a new feature
that hasn't been discussed is very unlikely to be merged

## Documentation, Bugfixes and Tests

Improvements to documentation, fixes for existing bugs and new tests around
existing behaviour are usually welcome

## Lint and formatting

This project uses eslint and prettier to maintain some standards, please make
sure you use `npm run lint` before sending a PR

## Weird effects

We use a dependency-injection pattern to manage effects. Effectful functions and
methods should return an async function that takes an infrastructure object.

Here's a small example (for a big example see `src/main.js`):

```javascript
const example = (name) => async (infra) => {
  infra.writeStdout(`Hello, ${name}\n`)
}

module.exports = example
```

The infrastructure object is defined in `src/infra.js`, new capabilities should
be added there.

This choice is to make end-to-end testing easier (without mocking modules) and
to make boundaries explicit.

## Testing style

For features we prefer an end-to-end test with faked infra (see
`src/main.test.js`), i.e. a test that runs the `main` function from
`src/main.js` with specific inputs and observes effects through the faked infra

This enables our tests to resemble the way our software is used (mostly).

code in `src/infra.js` is lower priority (and more difficult) to test

Pure code that makes sense in isolation, should be unit tested

## Coverage
