import { Feature } from './feature.js'

export function changelog () {
  const feature = new Feature()
  feature.files.push({
    copy: 'CHANGELOG.md'
  })

  return feature
}
