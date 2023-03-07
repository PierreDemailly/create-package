
import { vi, expect, test } from 'vitest'
import { testing } from '../src/testing.js'

function * mockPromptsValues () {
  yield { addTestLibrary: true }
  yield { testRunner: 'node:test' }
  yield { addTestLibrary: true }
  yield { testRunner: 'vitest' }
  yield { addTestLibrary: true }
  yield { testRunner: 'tap' }
}

const mockPromptsValues$ = mockPromptsValues()

vi.mock('../src/prompts.js', () => {
  return {
    prompts: async () => {
      return mockPromptsValues$.next().value
    },
    choicesFrom: vi.fn((choices) => {
      return choices.map(choice => ({ title: choice, value: choice }))
    })
  }
})

test('node:test', async () => {
  const { scripts, devDeps } = await testing()
  expect(scripts).toStrictEqual([
    { name: 'test', value: 'node --test ./test/**.test.js' }
  ])
  expect(devDeps).toStrictEqual([])
})

test('vitest', async () => {
  const { scripts, devDeps } = await testing()
  expect(scripts).toStrictEqual([
    { name: 'test', value: 'vitest run' },
    { name: 'test:c8', value: 'vitest run --coverage' }
  ])
  expect(devDeps).toStrictEqual(['vitest', '@vitest/coverage-c8'])
})

test('tap', async () => {
  const { scripts, devDeps } = await testing()
  expect(scripts).toStrictEqual([
    { name: 'test', value: 'tap --no-coverage ./test/**.test.js' },
    { name: 'test:c8', value: 'tap ./test/**.test.js' }
  ])
  expect(devDeps).toStrictEqual(['tap'])
})
