/*
  Binds action event to chainable proxy to enable partial application of dispatch function.

  Usage:
    const { resolve, dispatch } = app
    const convert = resolve('convert.unit')
    let result = await convert(type, value, to, from)

    // However convert can be partially applied
    // Which makes building helper functions that use dispatch a lot easier
    const convert = resolve('convert')
    let result = await convert.unit(type, value, to, from)

    // Or:
    const do = resolve()
    let result = do.convert.unit(type, value, to, from)

    // Which is the same as:
    let result = dispatch('convert.unit', { type, value, to, from })
 */

let handler = {
  get: function(target, name) {
    let actionType = target.__action_type ? (target.__action_type + '.' + name) : name
    return resolve(actionType)
  },

  apply: function(target, thisArg, args) {
    return target.__app.dispatch(target.__action_type, args)
  }
}

export default function resolve(actionType = '') {
  return new Proxy({
    '__action_type': actionType
    '__app':         this
  }, handler)
}