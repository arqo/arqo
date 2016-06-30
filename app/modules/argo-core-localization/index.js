import resolve from './resolve'

export default function localizationMiddleware(app, config) {
  const { resolve, dispatch } = app
  const session = resolve('session')

  return compose(
    only('culture.default', async (action, next) => {
      return await dispatch('settings.culture.default')
    }),
    only('culture.get', async (action, next) => {
      return await either(session.get('culture'), dispatch('culture.default'))
    }),
    only('culture.set', async (action, next) => {
      const newCulture = action.params[0]
      const isValid    = await dispatch('culture.valid', newCulture)

      if (!isValid) {
        return;
      }

      return await session.set('culture', newCulture)
    }),
    only('culture.valid', async (action, next) => {
      const culture           = action.params[0]
      const installedCultures = await dispatch('settings.culture.active')

      return installedCultures && installedCultures.indexOf(culture) >= 0
    })
  )
}