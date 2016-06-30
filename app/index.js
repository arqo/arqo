import Argo from './modules/argo'
import config from './config'

const argo = new Argo()

// Core
argo.use(require('./modules/argo-core').default(argo, config))
argo.use(require('./modules/argo-memory-cache').default(argo))

// Plugins
argo.use(require('./modules/argo-convert').default(argo, config))
argo.use(require('./modules/argo-yahoocurrency').default(argo, config))