import Argo from './modules/argo'
import config from './config'

const argo = new Argo()

argo.use(require('./modules/argo-core')(argo, config))
argo.use(require('./modules/argo-memory-cache')(argo))