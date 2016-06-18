/*
  Various helper functions for filtering actions
 */

/*
  Only call function if action is an exact match.

  Usage:
    only('route.change', async function(action, next) { ... })
 */
export function only(boundAction, fn) {
  return async function(action, next) {
    if (boundAction === action) {
      return fn(action, next)
    }

    return;
  }
}

/*
  Only call function if action is in a list of possible actions.

  Usage:
    oneOf(['route.change', 'other.action'], async function(action, next) { ... })
 */
export function oneOf(boundActions, fn) {
  return async function(action, next) {
    if (boundActions.indexOf(action) >= 0) {
      return fn(action, next)
    }

    return;
  }
}

/*
  Only call function if action matches a regular expression.

  Usage:
    matches(/$route.(.*)/, async function(action, next) { ... })
 */
export function matches(regex, fn) {
  return async function(action, next) {
    if (action.test(regex)) {
      return fn(action, next)
    }

    return;
  }
}