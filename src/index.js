const infra = require('./infra')
const mainImpl = require('./main')

const main = (...args) => mainImpl(...args)(infra)
module.exports = main
