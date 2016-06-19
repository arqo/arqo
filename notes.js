argo-core
argo-core-users
argo-core-permissions
argo-core-localization
argo-core-settings

// Content
argo-core-page
argo-trait-versionable
argo-trait-localizable
argo-trait-schedulable
argo-content-admin

// Fields
argo-field
argo-field-group
argo-field-repeater
argo-field-polymorphic-repeater  // extends argo-field-type-repeater

argo-field-text
argo-field-textarea
argo-field-select
argo-field-wysiwyg
argo-field-code
argo-field-map
argo-field-media
argo-field-image // extends argo-field-type-media
argo-field-video // extends argo-field-type-media
argo-field-related

// Blog
argo-blog
argo-blog-admin

// Shop
argo-shop
argo-shop-admin
argo-shop-review

argo-shop-payment-mock
argo-shop-payment-paypalstandard

argo-shop-shipping-austpost
argo-shop-shipping-fedex
argo-shop-shipping-flatrate
argo-shop-shipping-mock

argo-shop-tax-flatrate
argo-shop-discount-simple

// Social
argo-social
argo-social-admin
argo-social-discussion
argo-social-group

argo-marketing-ab
argo-marketing-contact
argo-marketing-personas
argo-marketing-seo

// Plugins
argo-banhammer
argo-convert
argo-yahoocurrency

// Themes
argo-theme-admin
argo-theme-alpha





// index.js

argo.use(require('argo-core'))
argo.use(require('argo-core-user'))
argo.use(require('argo-core-permission'))
argo.use(require('argo-core-localization'))


// example plugin

// export const meta = {
//   name:        require('package.json').name,
//   description: require('package.json').description,
//   version:     require('package.json').version
// }

// function onLoad() {
//   const convert = argo.resolve('convert');
//   convert.unit(100, 'g', 'kg');

//   const admin = argo.resolve('request.admin');
//   admin.get('/', function(req, res) {

//   })
// }

// argo.bind('startup', function() {
//   argo.bind('request', '/admin', function(req, res) {
//     res.write('Test')
//   })

//   // Same as
//   argo.request.admin.get('/', function() {})

//   argo.bind('convert.unit', function(value, type, to, from) {
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
const only = require('argo-action-filters').only
const route = only('route.change')
const admin = require('argo-router').any('/admin')
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

convert(type, value, to, from)

// Plugin
export default function(app) {
  // ...
}