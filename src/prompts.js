import _prompts from 'prompts'
import ansi from 'ansi-styles'

import { clearLastLine } from './utils.js'

const kTick = `${ansi.green.open}✔${ansi.green.close}`
const kCross = `${ansi.red.open}✖${ansi.red.close}`
const kPointer = `${ansi.gray.open}›${ansi.gray.close}`

export async function prompts (options) {
  const customOptions = {}

  const type = options.type

  if (type === 'text') {
    Object.assign(customOptions, {
      validate: (input) => {
        clearLastLine()

        if (!input && options.required) {
          return 'Required' // TODO?
        }

        return true
      }
    })
  } else if (type === 'confirm') {
    Object.assign(customOptions, {
      format: async (input) => {
        clearLastLine()

        if (input === false || input || options.initial) {
          clearLastLine()
        }

        console.log(`${input ? kTick : kCross} ${options.message}`)

        return input
      }
    })
  } else if (type === 'select') {
    // TODO: handle required choice.
    Object.assign(customOptions, {
      format: (value) => {
        clearLastLine()
        clearLastLine()

        if (!options.ignoreFormatChoices?.includes(value)) {
          console.log(`${kTick} ${options.message} ${kPointer} ${value.name || value}`)
        }

        return value
      }
    })
  }

  return _prompts({ ...options, ...customOptions })
}

export async function prompt (message, required = false) {
  const { value } = await prompts({ name: 'value', type: 'text', message, required })

  return value
}

export function choicesFrom (choices) {
  return choices.map(choice => ({ title: choice, value: choice }))
}
