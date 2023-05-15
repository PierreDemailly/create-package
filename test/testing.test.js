// Import Third-party Dependencies
import { vi, expect, test } from 'vitest'

// Import Internal Dependencies
import { testing } from '../src/testing.js'

function * mockPromptsValues () {
  yield true
  yield 'node:test'
  yield true
  yield 'vitest'
  yield true
  yield 'tap'
}

const mockPromptsValues$ = mockPromptsValues()

vi.mock('@topcli/prompts', () => {
  return {
    select: async () => mockPromptsValues$.next().value,
    confirm: async () => mockPromptsValues$.next().value
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
