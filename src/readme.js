// Import Internal Dependencies
import { Feature } from './feature.js'

export function readme (packageName) {
  const feature = new Feature()
  feature.files.push({
    path: 'README.md',
    content: `# ${packageName}`
  })

  return feature
}
