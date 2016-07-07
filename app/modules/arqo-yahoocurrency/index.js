import get from 'lodash/get'
import { only } from '../arqo-action-filters'

export default function convertCurrency(app) {
  const { dispatch } = app

  return only('convert.currency', async (action, next) => {
    const [value, to, from = null] = action.params

    if (from === null) {
      from = await dispatch('settings.units.currency')
    }

    // Get plugin settings
    const settings = await dispatch('settings.yahoocurrency')

    if(settings === null || settings.enabled) {
      const data = await getYahooFinanceCurrencyRates(app, settings)
      let fromVal, toVal

      if (data[from]) {
        fromVal = data[from]['value']
      } else {
        return
      }

      if (data[to]) {
        toVal = data[to]['value']
      } else {
        return
      }

      return value * (toVal / fromVal)
    }

    return
  })
}

async function getYahooFinanceCurrencyRates(app, settings) {
  const { resolve, dispatch } = app
  const cache = resolve('cache')
  const duration = settings && settings.duration ? settings.duration : 24 * 60 * 60

  let data = await cache.get('yahoo_currency_data')

  if(data == null || Date.now() - data.updated > duration) {
    const settings = await dispatch('settings')

    let rates      = {}
    let base       = get(settings, 'units.currency', 'USD')
    let currencies = get(settings, 'currency', [])

    base = base.toUpperCase()

    let requestData = Object.keys(currencies).map((c) => {
      return base + c.toUpperCase() + '=X'
    })

    if (requestData.length < 1) {
      throw new Error('Invalid request data. Have you added currencies to your config?')
    }

    // Example URL format (with USD base): http://download.finance.yahoo.com/d/quotes.csv?s=USDAUD=X,USDUSD=X,USDGBP=X&f=sl1&e=.csv
    const response = await fetch('http://download.finance.yahoo.com/d/quotes.csv?s=' + requestData.join(',') + '&f=sl1&e=.csv')

    if (!response.ok) {
      throw new Error('Failed to fetch currency data')
    }

    let body  = await response.text()
    let lines = body.trim().split("\n")

    if (lines.length < 1) {
      throw new Error('Currency request data invalid or empty')
    }

    lines.forEach((line) => {
      if (line.length < 1) {
        return
      }

      let value    = parseFloat(line.substring(11, 11+6))
      let currency = line.substring(4, 4+3).toLowerCase()

      if (currency === base) {
        value = 1
      }

      rates[currency] = { value }
    })

    data = {
      updated: Date.now(),
      rates
    }

    cache.set('yahoo_currency_data', data)
  }

  return data ? data['rates'] : null
}