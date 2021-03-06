import { startsWith } from '../argo-action-filters'

let cache = {}

const methods = {
  get: function(key) {
    const data = cache[key]

    if (data && data.expiry > Date.now()) {
      return data.value
    }

    return null
  },

  set: function(key, value, expiry = 24 * 60 * 60) {
    cache[key] = { value, expiry: Date.now() + expiry }
  }
}

export default function memoryCache() {
  return startsWith('cache.', async (action, next, prev = null) => {
    if (prev !== null) {
      return prev
    }

    const [, type] = action.event.split('.')
    methods[type].apply(null, action.params)
  })
}