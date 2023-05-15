// Import Internal Dependencies
import { Feature } from './feature.js'

export function gitignore () {
  const feature = new Feature()
  feature.files.push({
    copy: 'gitignore',
    path: '.gitignore'
  })

  return feature
}
