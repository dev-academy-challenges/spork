import timestampStream from './timestamp.js'
import censorStream from './censor.js'

/**
 * @param {import('./infra/Infra.js').SpawnedCP} cp
 * @param {import('./infra/Infra.js').IInfra} eff
 */
async function forward(cp, eff) {
  const { GITHUB_ACCESS_TOKEN } = eff.env()
  cp.stdout
    .pipe(censorStream(GITHUB_ACCESS_TOKEN))
    .pipe(timestampStream(`(${cp.name}:out)`))
    .pipe(eff.stdout, { end: false })

  cp.stderr
    .pipe(censorStream(GITHUB_ACCESS_TOKEN))
    .pipe(timestampStream(`(${cp.name}:err)`))
    .pipe(eff.stdout, { end: false })

  await cp.exit
}
export default forward
