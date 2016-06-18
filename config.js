export default {
  settings: {
    // Default Units
    units: {
      weight:   'kg',
      length:   'm',
      currency: 'usd',
      speed:    'kmh'
    },

    // Weight Units
    weight: {
      kg: {
        name: 'Kilogram',
        value: 1
      },
      g: {
        name: 'Gram',
        value: 1000
      },
      lb: {
        name: 'Pound',
        value: 2.2046
      },
      oz: {
        name: 'Ounce',
        value: 35.274
      }
    },

    // Length Units
    length: {
      m: {
        name: 'Meter',
        value: 1
      },
      cm: {
        name: 'Centimeter',
        value: 100
      },
      mm: {
        name: 'Millimeter',
        value: 1000
      },
      in: {
        name: 'Inch',
        value: 39.37008
      },
      ft: {
        name: 'Feet',
        value: 3.28084
      }
    },

    // Currency Units
    // Can set conversion rates manually here
    // Automatic conversion requires currency conversion plugin
    currency: {
      usd: {
        name: 'US Dollar',
        value: 1
      },
      aud: {
        name: 'Australian Dollar',
        value: null
      },
      gbp: {
        name: 'Pound Sterling',
        value: null
      },
      eur: {
        name: 'Euro',
        value: null
      }
    },

    // Speed Units
    // Just an example of a custom conversion unit
    speed: {
      kmh: {
        name: 'Kilometers Per Hour',
        value: 1
      },
      mph: {
        name: 'Miles Per Hour',
        value: 0.621371
      }
    }
  }
}