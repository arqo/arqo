arqo-core
arqo-core-users
arqo-core-permissions
arqo-core-localization
arqo-core-settings

// Content
arqo-core-page
arqo-trait-versionable
arqo-trait-localizable
arqo-trait-schedulable
arqo-trait-sluggable
arqo-trait-softdeletable
arqo-content-admin

// Fields
arqo-field
arqo-field-group
arqo-field-repeater
arqo-field-polymorphic-repeater  // extends arqo-field-type-repeater

arqo-field-text
arqo-field-textarea
arqo-field-select
arqo-field-wysiwyg
arqo-field-code
arqo-field-map
arqo-field-media
arqo-field-image // extends arqo-field-type-media
arqo-field-video // extends arqo-field-type-media
arqo-field-related

// Blog
arqo-blog
arqo-blog-admin

// Shop
arqo-shop
arqo-shop-admin
arqo-shop-review

arqo-shop-payment-mock
arqo-shop-payment-paypalstandard

arqo-shop-shipping-austpost
arqo-shop-shipping-fedex
arqo-shop-shipping-flatrate
arqo-shop-shipping-mock

arqo-shop-tax-flatrate
arqo-shop-discount-simple

// Social
arqo-social
arqo-social-admin
arqo-social-discussion
arqo-social-group

arqo-marketing-ab
arqo-marketing-contact
arqo-marketing-personas
arqo-marketing-seo

// Plugins
arqo-banhammer
arqo-convert
arqo-yahoocurrency

// Themes
arqo-theme-admin
arqo-theme-alpha





// index.js

arqo.use(require('arqo-core'))
arqo.use(require('arqo-core-user'))
arqo.use(require('arqo-core-permission'))
arqo.use(require('arqo-core-localization'))


// example plugin

// export const meta = {
//   name:        require('package.json').name,
//   description: require('package.json').description,
//   version:     require('package.json').version
// }

// function onLoad() {
//   const convert = arqo.resolve('convert');
//   convert.unit(100, 'g', 'kg');

//   const admin = arqo.resolve('request.admin');
//   admin.get('/', function(req, res) {

//   })
// }

// arqo.bind('startup', function() {
//   arqo.bind('request', '/admin', function(req, res) {
//     res.write('Test')
//   })

//   // Same as
//   arqo.request.admin.get('/', function() {})

//   arqo.bind('convert.unit', function(value, type, to, from) {
//     if(from === null) {
//       from = lunar.setting(`convert.units.${type}`);
//     }

//     if (from == to) {
//       return value;
//     }

//     if(config = lunar.setting(`data.${type}`) {
//       if (config[from]) {
//         from = config[from].value;
//       } else {
//         return null;
//       }

//       if (config[to]) {
//         to = config[to].value;
//       } else {
//         return null;
//       }

//       return value * (to / from);
//     } else {
//       return null;
//     }
//   })
// })


///////////////////
// Alternative API

// Routing
const only = require('arqo-action-filters').only
const route = only('route.change')
const admin = require('arqo-router').any('/admin')
const adminRoute = compose(route, admin) // ????
app.use(adminRoute('/posts/:id', async function(action, next) {
  // Handle route
  // action.event == 'route.change'
}))

export default function convert() {
  return only('convert.unit', async (action, next) => {
    const {value, type, to, from = null} = action

    if (from === null) {
      from = await resolve(`settings.convert.units.${type}`)()
    }

    if (from == to) {
      return value
    }

    const config = await resolve(`settings.${type}`)()

    if(config) {
      if (config[from]) {
        from = config[from].value
      } else {
        return null
      }

      if (config[to]) {
        to = config[to].value
      } else {
        return null
      }

      return value * (to / from)
    } else {
      return null
    }
  })
}
app.use(convert())

app.use(async function(action, next) {
  const convert = await resolve('convert')
  let result = await convert.unit(100, 'g', 'kg')
})

// Helper function
async function convert(type, value, to, from = null) {
  return await resolve('convert.unit')(type, value, to, from)
}

const convert = resolve('convert.unit')
convert(type, value, to, from)

// Cache Middleware
const cache = resolve('cache')
cache.get('yahoocurrency.data')
cache.set('yahoocurrency.data', data, 24 * 60 * 60)

// Plugin
export default function(app) {
  // ...
}



///////////////////////////
// Resolve proxy experiments

(function() {
  let handler = {
    get: function(target, name) {
      console.log('get', target, name)
      let actionType = target.__action_type ? (target.__action_type + '.' + name) : name
      console.log('get2', actionType)
      return resolve(actionType)
    },

    apply: function(target, thisArg, args) {
      console.log('apply', target, args)
      console.log('apply2', target.__app, target.__action_type)
      return target.__app.dispatch(target.__action_type, args)
    }
  }

  function resolve(actionType = '') {
    let state = function() {}
    state.__action_type = actionType
    state.__app = {
      dispatch: function(event, action) {
        console.log(event, action)
      }
    }

    return new Proxy(state, handler)
  }

  var $do = resolve()
  $do.some.action()
  $do.some.action('var1', 'var2', 'var3')
})()




///////////////////
// Models

// Log of all mutations
const log: [
  {
    event: 'product.mutate',
    body: {
      price: 129.9999
    },
    audit: {
      user_id: 1,
      timestamp: '2016-05-01T01:59:00Z'
    }
  }
]

const product = {
  type: 'simple', // simple, bundle, virtual, ...
  status: 'published',
  name: {
    'en-US': 'Test Product'
  },
  slug: {
    'en-US': 'test-product'
  }
  price: {
    default: 129.9999
  },
  taxClass: 1,
  shippingClass: 1,
  summary: {
    'en-US': 'This is a test product'
  },
  categories: [ 1, 3 ],
  tags: [ 'sometag', 'anothertag' ],
  attributes: {
    strength: 5,
    scent: 'fruity'
  },

  // Variant products
  options: {
    size: [
      {
        name: 'Small',
        value: 's'
      },
      {
        name: 'Medium',
        value: 'm'
      }
    ],
    color: [
      {
        name: 'Red',
        value: 'red'
      },
      {
        name: 'Green',
        value: 'green'
      }
    ]
  },
  variants: [
    ['s', 'red', {
      price: [10.0000, 'negate', 'percentage'],
      inventory: 99,
      images: ['small-red.jpg']
    }],
    ['m', 'red', {
      inventory: 0
    }]
  ],

  // Promotion engine
  promotions: [
    {
      ref: 'specialPrice',
      options: {
        price: [9.0000, 'negate', 'amount'], // negatePercentage, addAmount, addPercentage
        from: '2016-04-20T01:59:00Z',
        until: '2016-05-01T01:59:00Z'
      }
    },
    {
      ref: 'buyXGetXFree',
      options: {
        buy: 2,
        free: 1,
        excludes: [1001, 1134],
        from: '2016-04-20T01:59:00Z',
        until: '2016-05-01T01:59:00Z'
      }
    }
  ],
}