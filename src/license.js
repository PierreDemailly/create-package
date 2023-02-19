import spdxLicenseList from 'spdx-license-list/full.js'
import ansi from 'ansi-styles'

import { prompts } from './prompts.js'
import { Feature } from './feature.js'

export const kOtherLicenses = Symbol('OTHER_LICENSES')
export const kMostUsedLicenses = Symbol('MOST_USED_LICENSES')
const kPromptLisense = 'Choose a license'
const mostUsedLicenseKeys = [
  'MIT',
  'ISC',
  'Apache-2.0',
  'GPL-3.0+',
  'BSD-3-Clause'
]
const mostUsedLicenses = []
const otherLicenses = []

for (const [key, value] of Object.entries(spdxLicenseList)) {
  const { name } = value
  if (mostUsedLicenseKeys.includes(key)) {
    mostUsedLicenses.push({ title: name, value })
  } else {
    otherLicenses.push({ title: name, value })
  }
}

async function * showMostUsedLicenses () {
  const { license } = await prompts({
    type: 'select',
    name: 'license',
    message: kPromptLisense,
    choices: [...mostUsedLicenses, { title: `${ansi.yellow.open}See other licenses${ansi.yellow.close}`, value: kOtherLicenses }],
    ignoreFormatChoices: [kOtherLicenses]
  })

  if (license === kOtherLicenses) {
    yield * showOtherLicenses()
  } else {
    yield license
  }
}

async function * showOtherLicenses () {
  const { license } = await prompts({
    type: 'select',
    name: 'license',
    message: kPromptLisense,
    choices: [{ title: `${ansi.yellow.open}See most used licenses${ansi.yellow.close}`, value: kMostUsedLicenses }, ...otherLicenses],
    ignoreFormatChoices: [kMostUsedLicenses]
  })

  if (license === kMostUsedLicenses) {
    yield * showMostUsedLicenses()
  } else {
    yield license
  }
}

export async function license () {
  const feature = new Feature()
  const { value: license } = await showMostUsedLicenses().next()
  // TODO: the licenseText MAY includes <year> and <holders>. Replace with gitAuthor
  feature.files.push({
    path: 'LICENSE',
    content: license.licenseText
  })

  return feature
}
