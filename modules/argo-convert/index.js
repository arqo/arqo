import { only } from '../argo-action-filters'

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
    const convert = resolve('convert.unit')
    convert(type, value, to, from)
 */
export default function convert(app) {
  const {dispatch} = app

  return only('convert.unit', async (action, next) => {
    const {type, value, to, from = null} = action.params

    if (from === null) {
      from = await dispatch(`settings.convert.units.${type}`)
    }

    if (from == to) {
      return value
    }

    const config = await dispatch(`settings.${type}`)

    if(config) {
      if (config[from]) {
        from = config[from].value
      } else {
        return null
      }

      if (config[to]) {
        to = config[to].value
      } else {
        return null
      }

      return value * (to / from)
    } else {
      return null
    }
  })
}