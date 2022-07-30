const createRepo = (org, name) => async (infra) => {
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
    return await infra.post(options)
  } catch (e) {
    throw new Error(`Failed to create ${name} in ${org}: ${e.toString()}`)
  }
}

export default { createRepo }
