import resolve from './resolve'
import settingsMiddleware from './settings'

export default function arqoCore(app, config) {
  app.resolve = resolve.bind(app)

  return settingsMiddleware(app, config)
}