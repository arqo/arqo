import resolve from './resolve'
import settingsMiddleware from './settings'

export default function argoCore(app, config) {
  app.resolve = resolve.bind(app)

  return compose(
    settingsMiddleware(app, config)
  )
}