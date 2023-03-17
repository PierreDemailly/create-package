
import { vi, describe, expect, test } from 'vitest'

import { linter, kEslintScript } from '../src/linter.js'

function * mockPromptsValues () {
  yield { config: 'eslint-config-airbnb-base' }
  yield { config: 'xo' }
  yield * standardPrompts()
  yield { config: '@nodesecure/eslint-config' }
}

function * standardPrompts () {
  yield { config: 'standard' }
  yield { releaseItKaC: true }
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

describe('Testing each runner', () => {
  test('eslint-config-airbnb-base', async () => {
    const { deps, devDeps, files, scripts } = await linter()
    expect(deps).toStrictEqual([])
    expect(devDeps).toStrictEqual(['eslint', 'eslint-config-airbnb-base'])
    expect(files).toStrictEqual([{
      path: '.eslintrc',
      content: 'extends:\n\t- \'eslint-config-airbnb-base\'\n'
    }])
    expect(scripts).toStrictEqual([{
      name: 'lint',
      value: kEslintScript
    }])
  })

  test('xo', async () => {
    const { deps, devDeps, files, scripts } = await linter({ ESM: true })
    expect(deps).toStrictEqual([])
    expect(devDeps).toStrictEqual(['xo'])
    expect(files).toStrictEqual([])
    expect(scripts).toStrictEqual([{
      name: 'lint',
      value: 'npx xo'
    }])
  })

  test('standard', async () => {
    const { deps, devDeps, files, scripts } = await linter()
    expect(deps).toStrictEqual([])
    expect(devDeps).toStrictEqual(['standard', 'snazzy', '@release-it/keep-a-changelog'])
    expect(files).toStrictEqual([{ copy: '.release-it.json' }])
    expect(scripts).toStrictEqual([{
      name: 'lint',
      value: 'standard --fix | snazzy'
    }])
  })

  test('@nodesecure/eslint-config', async () => {
    const { deps, devDeps, files, scripts } = await linter()
    expect(deps).toStrictEqual([])
    expect(devDeps).toStrictEqual(['eslint', '@nodesecure/eslint-config'])
    expect(files).toStrictEqual([{
      path: '.eslintrc',
      content: 'extends:\n\t- \'@nodesecure/eslint-config\'\n'
    }])
    expect(scripts).toStrictEqual([{
      name: 'lint',
      value: kEslintScript
    }])
  })
})
