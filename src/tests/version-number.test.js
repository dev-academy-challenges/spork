import process from 'node:process'
import version from '../app-version.js'

describe('Version number', () => {
  it('Matches the package version', () => {
    expect(version).toBe(process.env.npm_package_version)
  })
})
