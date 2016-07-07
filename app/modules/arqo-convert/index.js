import { startsWith } from '../arqo-action-filters'

/*
  Automatically convert units based on settings

  Config example:
    settings: {
      units: {
        weight: 'kg' // Default unit
      },
      weight: {
        kg: {
          name: 'Kilogram',
          value: 1 // Default unit must always have value of 1
        },
        g: {
          name: 'Gram',
          value: 1000
        }
      }
    }

  Usage:
    const convert = resolve('convert')
    convert.length(value, to, from)
 */
export default function convert(app) {
  const {dispatch} = app

  return startsWith('convert.', async (action, next) => {
    const [, type] = action.event.split('.')
    let [value, to, from = null] = action.params

    if (!type) {
      throw new Error('Type required in action event.')
    }

    if (from === null) {
      from = await dispatch(`settings.units.${type}`)
    }

    if (from == to) {
      return value
    }

    const config = await dispatch(`settings.${type}`)

    if(config) {
      if (config[from]) {
        from = config[from].value
      } else {
        return
      }

      if (config[to]) {
        to = config[to].value
      } else {
        return
      }

      return value * (to / from)
    }

    return
  })
}