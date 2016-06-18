let handler = {
  get: function(target, name) {
    let actionType = target.__action_type ? (target.__action_type + '.' + name) : name
    return resolve(actionType)
  },

  apply: function(target, thisArg, args) {
    return target.__app.dispatch(Object.assign({}, args, {
      event: target.__action_type
    }))
  }
}

export default function resolve(actionType) {
  return new Proxy({
    '__action_type': actionType
    '__app':         this
  }, handler)
}