import infra from './infra/prod.js'
import main from './main.js'

/**
 * @type {(...args: string[]) => Promise<void>}
 */
export default (...args) => main(...args)(infra)

export const runWithInfra = main
