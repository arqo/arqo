'use strict';

var colors = require('colors/safe');
var isPromise = require('is-promise');

let middleware = [
  function(action, next, prev) {
    console.log('middleware-1', action, prev)
    const res = next(prev).then(() => 'yay1')
    return res
  },
  function(action, next, prev) {
    console.log('middleware-2', action, prev)
    return 'yay2'
  },
  function(action, next, prev) {
    console.log('middleware-2', action, prev)
    return 'yay3'
  },
  function(action, next, prev) {
    console.log('middleware-2', action, prev)
    return next().then(() => 'yay4')
  }
]

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (action) {
    let index = -1
    let out;

    const next = (prev) => {
      index++
      const task = middleware[index]
      prev = typeof(prev) === 'undefined' ? out : prev

      if(!task) {
        console.log(colors.grey('notask'), index)
        return Promise.resolve(prev)
      }

      const res = task(action, next, prev)

      out = typeof(res) !== 'undefined' ? res : prev

      console.log(colors.grey('res'), res)
      return isPromise(res) ? res : Promise.resolve(out)
    }

    const finalTaskPromise = middleware.reduce(function(prevTaskPromise) {
      return prevTaskPromise.then(next)
    }, Promise.resolve(undefined))

    return finalTaskPromise
  }
}

function dispatch(action) {
  console.log('dispatch', action)
  const finalTaskPromise = compose(middleware)(action)

  finalTaskPromise.then((a) => console.log(colors.green('dispatch (end):'), a))
                  .catch((e) => console.error(colors.red('dispatch (err):'), e))

  return finalTaskPromise
}

//// RUN
dispatch({event: 'event.one'}).then((a) => { console.log(colors.green('res-1'), a) })
//dispatch({event: 'event.two'}).then((a) => { console.log('res-2', a) })



process.on('unhandledRejection', (reason) => {
  console.log('unhandledRejection: ' + reason);
});








// function compose (middleware) {
//   if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
//   for (const fn of middleware) {
//     if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
//   }

//   return function (action) {
//     const finalTaskPromise = middleware.reduce(function(prevTaskPromise, task) {
//       return prevTaskPromise.then(function(prev) {
//         const res = task(action, function next() {

//         }, prev)
//         return isPromise(res) ? res : Promise.resolve(typeof(res) !== 'undefined' ? res : prev)
//       })
//     }, Promise.resolve(undefined))

//     return finalTaskPromise
//   }

//   // return function (context, next) {
//   //   // last called middleware #
//   //   let result;
//   //   let index = -1

//   //   return dispatch(0)

//   //   function dispatch (i) {
//   //     if (i <= index)
//   //       return Promise.reject(new Error('next() called multiple times'))

//   //     index = i
//   //     const fn = middleware[i] || next

//   //     if (!fn)
//   //       return Promise.resolve()

//   //     try {
//   //       let currentResult = Promise.resolve(fn(context, function next () {
//   //         return dispatch(i + 1)
//   //       }, result))

//   //       result = typeof(currentResult) === 'undefined' ? result : currentResult

//   //       return result;
//   //     } catch (err) {
//   //       return Promise.reject(err)
//   //     }
//   //   }
//   // }
// }