// Import Internal Dependencies
import { Feature } from './feature.js'

export function editorConfig () {
  const feature = new Feature()
  feature.files.push({
    copy: '.editorconfig'
  })

  return feature
}
