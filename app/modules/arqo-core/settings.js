import { only, startsWith } from '../arqo-action-filters'

// Returns setting from config
// Allows easy access to configuration variables
// Usage: await dispatch(`settings.units.${type}`)
export default function settings(app, config) {
  return [
    only('settings', async (action, next) => config['settings']),

    startsWith('settings.', async (action, next) => {
      return action.event.split('.').reduce((prev, cur) => {
        return prev !== null && prev[cur] !== undefined ? prev[cur] : null
      }, config)
    })
  ]
}