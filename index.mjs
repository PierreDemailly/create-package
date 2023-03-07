#!/usr/bin/env node

import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { createInterface } from 'node:readline'

import { Spinner } from '@topcli/spinner'

import { gitAuthor } from './src/utils.js'
import { choicesFrom, prompt, prompts } from './src/prompts.js'
import { license } from './src/license.js'
import { linter } from './src/linter.js'
import { Feature } from './src/feature.js'
import { testing } from './src/testing.js'
import { changelog } from './src/changelog.js'
import { readme } from './src/readme.js'
import { editorConfig } from './src/editorConfig.js'
import { gitignore } from './src/gitignore.js'

// force exit with CTRL + C
// because `prompts` handle it as a return value
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('SIGINT', () => {
  process.exit()
})

const execAsync = promisify(exec)

const packageName = await prompt('Package name', true)
const packageDesc = await prompt('Package description')
const { module } = await prompts({
  name: 'module',
  type: 'select',
  message: 'Is your project ESM or CommonJS ?',
  choices: choicesFrom(['module', 'commonjs']),
  initial: 0
})
const { isCLI } = await prompts({
  name: 'isCLI',
  type: 'confirm',
  message: 'Is your project a CLI ?',
  initial: false
})
const fLicense = await license()
const fTesting = await testing()
const fLinter = await linter({ ESM: module === 'module' })
const fChangelog = changelog()
const fGitignore = gitignore()
const fReadme = readme(packageName)
const fEditorConfig = editorConfig()

const createFilesSpinner = new Spinner({ name: 'line' }).start('Create project')

await mkdir(packageName)

const author = gitAuthor()
const mainFile = isCLI ? `${packageName}.js` : 'index.js'
const packageJson = (`\
{
  "name": "${packageName}",
  "version": "0.0.1",
  "description": "${packageDesc}",
  "scripts": {
      ${fTesting.extractScripts()}
      ${fLinter.extractScripts()}
      "pkg:ok": "npx pkg-ok"
  },
  "main": "${isCLI ? `./bin/${mainFile}` : `./${mainFile}`}",${isCLI
    ? `\n\t"bin": {
      "${packageName}": "./bin/${mainFile}"\n\t},`
    : ''}
  "keywords": [],
  "author": "${author}",
  "license": "${fLicense.license}",
  "type": "${module}"
}`)

await writeFile(join(process.cwd(), packageName, 'package.json'), packageJson)
fTesting.createFiles(packageName)
fLinter.createFiles(packageName)
fLicense.createFiles(packageName)
fChangelog.createFiles(packageName)
fGitignore.createFiles(packageName)
fReadme.createFiles(packageName)
fEditorConfig.createFiles(packageName)

if (isCLI) {
  await mkdir(`${packageName}/bin`)
}
const mainFilePath = join(process.cwd(), packageName, isCLI ? './bin' : './', mainFile)
await writeFile(mainFilePath, 'console.log("Hello world")')

createFilesSpinner.succeed(`Project initialized: ./${packageName}`)

const features = Feature.mergeAll()
const installSpinner = new Spinner({ name: 'line' }).start('Installing dependencies')
const devDeps = [...features.devDeps, 'pkg-ok']
const deps = [...features.deps]

await execAsync(`cd ${packageName} && npm i -D ${devDeps.join(' ')}`)
if (deps.length) {
  await execAsync(`cd ${packageName} && npm i ${deps.join(' ')}`)
}
installSpinner.succeed('Dependencies installed')

process.exit()
