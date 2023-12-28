export async function authenticate (params, { settings }) {
  const token = params[0]

  if (token === settings.guestKey) {
    return {
      resultCode: 1,
      resultMessage: 'OK',
      signUpToken: token,
      authenticationToken: settings.guestKey,
      coreUserId: settings.guestID,
      mergeStatus: 2
    }
  } else {
    return {
      resultCode: -1002,
      resultMessage: 'Invalid credentials',
      mergeStatus: 3
    }
  }
}

export async function logIn (params, { settings }) {
  const token = params[0]

  if (token === settings.guestKey) {
    return {
      resultCode: 1,
      resultMessage: 'OK',
      sessionKey: settings.guestKey,
      signInCount: 1
    }
  } else {
    return {
      resultCode: -1002,
      resultMessage: 'Invalid credentials'
    }
  }
}

export async function signUp (_params, { settings }) {
  return {
    resultCode: 1,
    resultMessage: 'OK',
    signUpToken: settings.guestKey,
    coreUserId: settings.guestID
  }
}
