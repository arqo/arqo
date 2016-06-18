import Argo from './modules/argo'

const argo = new Argo()

argo.use(require('./modules/argo-core'))
argo.use(require('./modules/argo-core-user'))
argo.use(require('./modules/argo-core-permission'))
argo.use(require('./modules/argo-core-localization'))