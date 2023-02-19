import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const instances = []

export class Feature {
  deps
  devDeps
  files
  scripts

  constructor () {
    instances.push(this)
    this.deps = []
    this.devDeps = []
    this.files = []
    this.scripts = []
  }

  static mergeAll () {
    return instances.reduce((acc, obj) => {
      for (const key in obj) {
        if (acc[key]) {
          acc[key].push(...obj[key])
        } else {
          acc[key] = [...obj[key]]
        }
      }
      return acc
    }, {})
  }

  createFiles (dir) {
    if (!this.files.length) {
      return
    }

    for (const file of this.files) {
      if (file.copy) {
        const content = readFileSync(path.resolve(__dirname, `./assets/${file.copy}`))
        writeFileSync(path.join(process.cwd(), dir, file.path ?? file.copy), content)

        return
      }

      writeFileSync(path.join(process.cwd(), dir, file.path), file.content)
    }
  }

  extractScripts () {
    if (!this.scripts.length) {
      return '\n'
    }

    return this.scripts.map((script) => {
      return `"${script.name}": "${script.value}",`
    }).join('\n')
  }
}
