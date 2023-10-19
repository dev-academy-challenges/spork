/**
 *
 * @param {string} org
 * @param {string} name
 * @returns {import('./infra/Infra.js').Eff<unknown>}
 */
export const createRepo = (org, name) => async (infra) => {
  const { GITHUB_ACCESS_TOKEN, GITHUB_USER } = infra.env()
  const authString = `${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}`
  const authBlob = Buffer.from(authString)
  const authBase64 = authBlob.toString('base64')

  const body = JSON.stringify({
    name,
    visibility: 'internal',
  })

  const options = {
    hostname: 'api.github.com',
    path: `/orgs/${org}/repos`,
    port: 443,
    method: 'POST',
    headers: {
      'User-Agent': 'fork-to-cohort',
      Authorization: `Basic ${authBase64}`,
      'Content-Type': 'application/json',
    },
    body,
  }

  try {
    return await infra.request(options)
  } catch (e) {
    throw new Error(`Failed to create ${name} in ${org}: ${String(e)}`)
  }
}

/**
 *
 * @param {string} owner
 * @param {string} repo
 * @returns {import('./infra/Infra.js').Eff<unknown>}
 */
export const setBranchProtection = (owner, repo) => async (infra) => {
  const { GITHUB_ACCESS_TOKEN, GITHUB_USER } = infra.env()
  const authString = `${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}`
  const authBlob = Buffer.from(authString)
  const authBase64 = authBlob.toString('base64')
  const branch = 'main'

  const body = JSON.stringify({
    enforce_admins: true,
    required_status_checks: null,
    required_pull_request_reviews: {
      dismissal_restrictions: {},
      dismiss_stale_reviews: true,
      require_code_owner_reviews: false,
      required_approving_review_count: 1,
    },
    restrictions: null,
  })

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/branches/${branch}/protection`,
    port: 443,
    method: 'PUT',
    headers: {
      'User-Agent': 'fork-to-cohort',
      Authorization: `Basic ${authBase64}`,
      'Content-Type': 'application/json',
    },
    body,
  }

  try {
    return await infra.request(options)
  } catch (e) {
    console.error(e)
    throw new Error(
      `Failed to set branch protections on ${owner}/${repo}: ${String(e)}`
    )
  }
}
