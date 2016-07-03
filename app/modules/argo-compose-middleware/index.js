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
    let prev

    const next = (_prev) => {
      const task = middleware[++index]
      prev = typeof(_prev) === 'undefined' ? prev : _prev

      if(!task) {
        return Promise.resolve(prev)
      }

      const res = task(action, next, prev)

      prev = typeof(res) !== 'undefined' ? res : prev

      return isPromise(res) ? res : Promise.resolve(prev)
    }

    const finalTaskPromise = middleware.reduce(function(prevTaskPromise) {
      return prevTaskPromise.then(next)
    }, Promise.resolve(undefined))

    return finalTaskPromise
  }
}