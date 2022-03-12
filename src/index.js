const infra = require('./infra/prod')
const mainImpl = require('./main')

const main = (...args) => mainImpl(...args)(infra)
module.exports = main
