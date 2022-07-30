import infra from './infra/prod.js'
import main from './main.js'

export default (...args) => main(...args)(infra)
