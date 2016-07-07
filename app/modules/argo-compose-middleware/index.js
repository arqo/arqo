import isPromise from 'is-promise'

function later(fn) {
  return new Promise(function(resolve, reject) {
    process.nextTick(function() {
      fn().then(resolve)
    })
  })
}

export default function compose (middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!')
  }

  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!')
    }
  }

  return async function (action) {
    let index = middleware.length
    let output

    const wrapTask = (task, action, prev) => {
      let res = task(action, prev)

      if (!isPromise(res)) {
        res = Promise.resolve(res)
      }

      return res.then((res) => {
        output = typeof(res) !== 'undefined' ? res : output
        return output
      })
    }

    let pending = []

    const finalTaskPromise = middleware.reduce(function(prev, task) {
      let i = --index

      if (i !== middleware.length) {
        pending.unshift(prev)
      }

      return wrapTask(task, action, function() {
        return later(() => pending[i])
      })
    }, Promise.resolve(undefined))

    pending.unshift(finalTaskPromise)
    pending.unshift(Promise.resolve(undefined))

    await Promise.all(pending)

    return Promise.resolve(output)
  }
}