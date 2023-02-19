
import { vi, expect, test } from 'vitest'
import { license, kMostUsedLicenses, kOtherLicenses } from '../src/license.js'
import spdxLicenseListFull from 'spdx-license-list/full.js'

function * mockPromptsValues () {
  yield { license: kOtherLicenses }
  yield { license: kMostUsedLicenses }
  yield { license: spdxLicenseListFull.MIT }
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

test('it should return MIT', async () => {
  const feature = await license()
  expect(feature.files).toStrictEqual([{ path: 'LICENSE', content: spdxLicenseListFull.MIT.licenseText }])
})
