import request from 'request'
import { only } from '../argo-action-filters'

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

      if (data[from]) {
        fromVal = data[from]['value']
      } else {
        return null
      }

      if (data[to]) {
        toVal = data[to]['value']
      } else {
        return null
      }

      return value * (toVal / fromVal)
    }

    return null
  })
}

async function getYahooFinanceCurrencyRates(app, settings) {
  const { resolve, dispatch } = app
  const cache = resolve('cache')
  const duration = settings.duration ? settings.duration : 24 * 60 * 60

  let data = await cache.get('yahoo_currency_data')

  if(data == null || Date.now() - data.updated > duration) {
    // Pull new rates from Yahoo

    let data  = {}
    let rates = []
    let [base, currencies] = await Promise.all(
      dispatch('settings.units.currency'),
      dispatch('settings.currency')
    )

    base = base ? base.toUpperCase() : 'USD'

    let requestData = currencies.map((c) => {
      return base + c.toUpperCase() + '=X'
    })

    // Example URL format (with USD base): http://download.finance.yahoo.com/d/quotes.csv?s=USDAUD=X,USDUSD=X,USDGBP=X&f=sl1&e=.csv
    const response = await request('http://download.finance.yahoo.com/d/quotes.csv?s=' + requestData.join(',') + '&f=sl1&e=.csv')

    if (response) {
      let lines = response.trim().split("\n")

      lines.forEach((line) => {
        let value    = parseFloat(line.substring(11, 6))
        let currency = line.substring(4, 3).toLowerCase()

        if (currency === base) {
          value = 1
        }

        rates[currency] = { value }
      }

      data = {
        updated: Date.now(),
        rates
      }

      cache.set('yahoo_currency_data', data)
    }
  }

  return data['rates']
}