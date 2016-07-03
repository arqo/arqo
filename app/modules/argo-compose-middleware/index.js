import isPromise from 'is-promise'

export default function compose (middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!')
  }

  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!')
    }
  }

  return function (action) {
    let index = -1
    let out
    let prevTaskPromise = Promise.resolve(undefined)

    const next = (prev) => {
      console.log('next')
      const task = middleware[++index]
      prev = typeof(prev) === 'undefined' ? out : prev

      if(!task) {
        out = false
        return
      }

      const res = task(action, next, prev)

      out = typeof(res) !== 'undefined' ? res : prev

      console.log('res', res)
      return isPromise(res) ? res : Promise.resolve(out)
    }

    while (!isPromise(out)) {
      prevTaskPromise = prevTaskPromise.then(next)
    }

    return Promise.resolve(out)
  }
}