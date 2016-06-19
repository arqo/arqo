/*
  Various helper functions for filtering actions
 */

/*
  Only call function if action event name is an exact match.

  Usage:
    only('route.change', async function(action, next) { ... })
 */
export function only(event, fn) {
  return async function(action, next) {
    if (event === action.event) {
      return fn(action, next)
    }

    return;
  }
}

/*
  Only call function if action event name is in a list of possible event names.

  Usage:
    oneOf(['route.change', 'other.action'], async function(action, next) { ... })
 */
export function oneOf(events, fn) {
  return async function(action, next) {
    if (events.indexOf(action.event) >= 0) {
      return fn(action, next)
    }

    return;
  }
}

/*
  Only call function if action event name starts with a specified string.

  Usage:
    startsWith('route.', async function(action, next) { ... })
 */
export function startsWith(event, fn) {
  return async function(action, next) {
    if (action.event.indexOf(event) === 0) {
      return fn(action, next)
    }

    return;
  }
}

/*
  Only call function if action event name matches a regular expression.

  Usage:
    matches(/$route.(.*)/, async function(action, next) { ... })
 */
export function matches(regex, fn) {
  return async function(action, next) {
    if (action.event.test(regex)) {
      return fn(action, next)
    }

    return;
  }
}