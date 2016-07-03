import Argo from './modules/argo'
import config from './config'

const argo = new Argo()

// Core
argo.use(require('./modules/argo-core').default(argo, config))
argo.use(require('./modules/argo-memory-cache').default(argo))

// Plugins
argo.use(require('./modules/argo-convert').default(argo))
argo.use(require('./modules/argo-yahoocurrency').default(argo))

// Simple dispatch examples
argo.dispatch('settings.culture.default').then(console.log)
argo.dispatch('convert.weight', [10, 'kg', 'g']).then((res) => {console.log('g->kg', res)})
argo.dispatch('convert.weight', [10, 'g', 'kg']).then((res) => {console.log('kg->g', res)})
argo.dispatch('convert.currency', [100, 'aud', 'usd']).then((res) => {console.log('usd->aud', res)})