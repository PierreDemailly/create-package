import { Feature } from './feature.js'

export function gitignore () {
  const feature = new Feature()
  feature.files.push({
    copy: '.gitignore'
  })

  return feature
}
