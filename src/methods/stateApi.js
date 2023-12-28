export async function syncState (params, { sessionKey, settings }) {
  const state = params[0]
  if (typeof state !== 'object') throw {
    code: -32602,
    message: 'Invalid params'
  }

  if (sessionKey === null) {
    throw {
      code: 3,
      message: 'No session key error'
    }
  } else if (sessionKey === settings.guestKey) {
    return { stateUpdateOutcome: 'CLIENT_REQUEST_ACCEPTED' }
  } else {
    throw {
      code: 2,
      message: 'Authentication error'
    }
  }
}
