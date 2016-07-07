import Arqo from './modules/arqo'
import config from './config'

const arqo = new Arqo()

// Core
arqo.use(require('./modules/arqo-core').default(arqo, config))
arqo.use(require('./modules/arqo-memory-cache').default(arqo))

// Plugins
arqo.use(require('./modules/arqo-convert').default(arqo))
arqo.use(require('./modules/arqo-yahoocurrency').default(arqo))

// Simple dispatch examples
arqo.dispatch('settings.culture.default').then(console.log)
arqo.dispatch('convert.weight', [10, 'kg', 'g']).then((res) => {console.log('g->kg', res)})
arqo.dispatch('convert.weight', [10, 'g', 'kg']).then((res) => {console.log('kg->g', res)})
arqo.dispatch('convert.currency', [100, 'aud', 'usd']).then((res) => {console.log('usd->aud', res)})