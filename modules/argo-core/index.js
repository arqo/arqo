import resolve from './resolve'

export default function argoCore(app) {
  app.resolve = resolve.bind(app)

  return async (action, next) => {
    // @todo add core middleware
    return
  }
}