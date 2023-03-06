
import { license, kMostUsedLicenses, kOtherLicenses } from '../src/license.js'

import { vi, expect, test } from 'vitest'
import spdxLicenseListFull from 'spdx-license-list/full.js'

function * mockPromptsValues () {
  yield kOtherLicenses
  yield kMostUsedLicenses
  yield spdxLicenseListFull.MIT
}

const mockPromptsValues$ = mockPromptsValues()

vi.mock('@topcli/prompts', () => {
  return {
    select: async () => mockPromptsValues$.next().value
  }
})

test('it should return MIT', async () => {
  const feature = await license()
  expect(feature.files).toStrictEqual([{ path: 'LICENSE', content: spdxLicenseListFull.MIT.licenseText }])
})
