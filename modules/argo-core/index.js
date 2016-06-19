import resolve from './resolve'

export default function argoCore(app, config) {
  app.resolve = resolve.bind(app)

  // Returns setting from config
  // Allows easy access to configuration variables
  // Usage: await dispatch(`settings.convert.units.${type}`)
  const settingsMiddleware = startsWith('settings.', async (action, next) => {
    return action.event.split('.').reduce((prev, cur) => {
      return prev !== null && prev[cur] !== undefined ? prev[cur] : null
    }, config)
  })

  const exampleMiddleware2 = async (action, next) => { return }

  return compose(exampleMiddleware, exampleMiddleware2)
}