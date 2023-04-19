import { confirm, select } from '@topcli/prompts'

import { Feature } from './feature.js'

export const kEslintScript = 'eslint ./**/**.js'

export async function linter (options = {}) {
  const kConfigs = ['standard', '@nodesecure/eslint-config', 'eslint-config-airbnb-base']
  const feature = new Feature()

  if (options.ESM) {
    kConfigs.push('xo')
  }

  const config = await select('Choose linter config', {
    choices: kConfigs
  })

  if (config === 'standard') {
    feature.devDeps.push('standard', 'snazzy')
    feature.scripts.push({
      name: 'lint',
      value: 'standard --fix | snazzy'
    })

    const releaseItKaC = await confirm('Add @release-it/keep-a-changelog ?', {
      message: 'Add @release-it/keep-a-changelog ?'
    })

    if (releaseItKaC) {
      feature.devDeps.push('@release-it/keep-a-changelog')
      feature.files.push({ copy: '.release-it.json' })
    }
  } else if (config === 'xo') {
    feature.devDeps.push('xo')
    feature.scripts.push({ name: 'lint', value: 'npx xo' })
  } else {
    feature.devDeps.push('eslint', config)
    const eslintrc = `extends:\n\t- '${config}'\n`
    feature.files.push({
      path: '.eslintrc',
      content: eslintrc
    })
    feature.scripts.push({ name: 'lint', value: kEslintScript })
  }

  return feature
}
