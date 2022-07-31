/**
 *
 * @param {string | number} s
 * @returns string
 */
const pad = (s) => (`${s}`.length === 2 ? `${s}` : `0${s}`)

/**
 *
 * @param {Date} d
 * @returns {string}
 */
const formatDate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export default formatDate
