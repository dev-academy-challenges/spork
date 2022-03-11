const pad = (s) => (`${s}`.length === 2 ? `${s}` : `0${s}`)

const formatDate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${d.getDate()}`

module.exports = formatDate
