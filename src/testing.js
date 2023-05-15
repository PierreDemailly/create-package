// Import Third-party Dependencies
import { confirm, select } from '@topcli/prompts'

// Import Internal Dependencies
import { Feature } from './feature.js'

export async function testing () {
  const feature = new Feature()

  const addTestLibrary = await confirm('Will you write unit tests?', {
    initial: true
  })

  if (addTestLibrary) {
    const testRunner = await select('Choose your test runner', {
      choices: ['node:test', 'tap', 'vitest']
      // TODO: required
    })
    feature.devDeps.push(...getRunnerDeps(testRunner).next().value)
    feature.scripts.push(...getRunnerScripts(testRunner).next().value)
  }

  return feature
}

function * getRunnerDeps (runner) {
  switch (runner) {
    case 'node:test':
      yield []
      break

    case 'tap':
      yield ['tap']
      break

    case 'vitest':
      yield ['vitest', '@vitest/coverage-c8']
      break

    default:
      throw Error(`unknown runner ${runner}`)
  }
}

function * getRunnerScripts (runner) {
  switch (runner) {
    case 'node:test':
      yield [
        { name: 'test', value: 'node --test ./test/**.test.js' }
      ]
      break

    case 'tap':
      yield [
        { name: 'test', value: 'tap --no-coverage ./test/**.test.js' },
        { name: 'test:c8', value: 'tap ./test/**.test.js' }
      ]
      break

    case 'vitest':
      yield [
        { name: 'test', value: 'vitest run' },
        { name: 'test:c8', value: 'vitest run --coverage' }
      ]
      break

    default:
      throw Error(`unknown runner ${runner}`)
  }
}
