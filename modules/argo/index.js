import Koa from 'koa'
import compose from 'compose'
import resolve from './argo-core/resolve'

class Application {
  construct(koa = null) {
    this.koa        = koa === null ? new Koa() : koa
    this.middleware = []

    this.koa.use(async (ctx, next) => {
      return await this.apply(this.createActionFromKoaContext(ctx))
    })

    // Bind Class Functions
    this.apply                      = this.apply.bind(this)
    this.dispatch                   = this.dispatch.bind(this)
    this.createAction               = this.createAction.bind(this)
    this.createActionFromKoaContext = this.createActionFromKoaContext.bind(this)
  }

  use(fn) {
    this.middleware.push(fn)
    return this
  }

  apply(action) {
    return compose(this.middleware).call(null, action)
  }

  dispatch(event, action = {}) {
    return this.apply(this.createAction(event, action))
  }

  createAction(event, action = {}) {
    return Object.assign(action, { event })
  }

  createActionFromKoaContext(ctx) {
    return this.createAction('route.change', ctx)
  }

  launch() {
    koa.listen()
  }
}

export default Application