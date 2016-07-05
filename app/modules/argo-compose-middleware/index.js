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

    async function next(prev) {
      const task = middleware[++index]
      prev = typeof(prev) === 'undefined' ? out : prev

      if(!task) {
        return Promise.resolve(out)
      }

      const res = await task(action, next, prev)

      out = typeof(res) !== 'undefined' ? res : prev

      return Promise.resolve(out)
    }

    const finalTaskPromise = middleware.reduce(function(prevTaskPromise) {
      return prevTaskPromise.then(next)
    }, Promise.resolve(undefined))

    return finalTaskPromise
  }
}

// 1.then(2.then(3.then(4.then))).then(1.2).then(4.2)