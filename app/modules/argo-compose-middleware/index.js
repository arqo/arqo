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
    let output

    const wrapTask = (res) => {
      //console.log(1, action.event, res)

      if (!isPromise(res)) {
        res = Promise.resolve(res)
      }

      res.then((res) => {
        console.log(2, action.event, res)
        output = typeof(res) !== 'undefined' ? res : output
        console.log('---->', action.event, output)
        //return output
      })

      return res
    }

    const finalTaskPromise = middleware.reduce(function(prev, task) {
      return wrapTask(task(action, prev)).then(prev)
    }, Promise.resolve(undefined))

    return finalTaskPromise.then(() => output)
  }
}

// 1.then(2.then(3.then(4.then))).then(1.2).then(4.2)


// export default function compose (middleware) {
//   if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
//   for (const fn of middleware) {
//     if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
//   }

//   return function (action, next) {
//     // last called middleware #
//     let output
//     let index = -1

//     const wrapTask = (res) => {
//       console.log(1, res)

//       if (!isPromise(res)) {
//         res = Promise.resolve(res)
//       }

//       // res.then((res) => {
//       //   console.log(2, res)
//       //   output = typeof(res) !== 'undefined' ? res : output
//       //   return output
//       // })

//       return res
//     }

//     function dispatch (i) {
//       if (i <= index) return Promise.reject(new Error('next() called multiple times'))

//       index = i
//       const fn = middleware[i] || next

//       if (!fn) return Promise.resolve()

//       try {
//         return wrapTask(fn(action, function next () {
//           return dispatch(i + 1)
//         }))
//       } catch (err) {
//         return Promise.reject(err)
//       }
//     }

//     return dispatch(0)
//   }
// }