/*
  any('/admin')('/posts')('/:id')(async () => { return })
  any('/admin')('/posts/:id', async () => { return })
 */
export function any(pathOrFn, _fn = null) {
  let fn   = typeof(pathOrFn) === 'function' ? pathOrFn : _fn
  let path = this.path ? this.path : ''

  path = typeof(pathOrFn) === 'function' ? path : path + pathOrFn

  if (fn) {
    if (!path) {
      console.warn('Empty path provided to router')
    }

    return (action, next) => {
      if (this.path === action.request.path) { // @todo make this support keys like :id or :cat
        return fn(action, next)
      }
    }
  }

  return any.bind({
    path: path
  })
}

export function get() {

}

export function post() {

}

export function put() {

}

export function patch() {

}

export function del() {

}