const Promise = require('any-promise')

/**
 * Based on `koa-compose`!!!
 *
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (action) {
    const finalTaskPromise = middleware.reduce(function(prevTaskPromise, task) {
      return prevTaskPromise.then(function() {
        const res = Promise.resolve(task(action, function next() {
          // todo
        }))

        return typeof(res) !== 'undefined' ? res : false // replace false with prev
      })
    }, Promise.resolve(true))

    return finalTaskPromise
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  // return function (context, next) {
  //   // last called middleware #
  //   let index = -1
  //   return dispatch(0)
  //   function dispatch (i) {
  //     if (i <= index) return Promise.reject(new Error('next() called multiple times'))
  //     index = i
  //     const fn = middleware[i] || next
  //     if (!fn) return Promise.resolve()
  //     try {
  //       return Promise.resolve(fn(context, function next () {
  //         return dispatch(i + 1)
  //       }))
  //     } catch (err) {
  //       return Promise.reject(err)
  //     }
  //   }
  // }
}
