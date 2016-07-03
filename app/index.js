import Argo from './modules/argo'
import config from './config'

const argo = new Argo()

// Core
argo.use(require('./modules/argo-core').default(argo, config))
//argo.use(require('./modules/argo-memory-cache').default(argo))

// Plugins
argo.use(require('./modules/argo-convert').default(argo, config))
//argo.use(require('./modules/argo-yahoocurrency').default(argo, config))

// Simple dispatch examples
argo.dispatch('settings.culture.default').then(console.log)
argo.dispatch('convert.weight', [10, 'kg', 'g']).then(console.log)
argo.dispatch('convert.weight', [10, 'g', 'kg']).then(console.log)