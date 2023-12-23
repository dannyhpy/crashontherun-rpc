import { genericID, genericKey } from '../constants.js'

export async function authenticate (params) {
  const token = params[0]

  if (token === genericKey) {
    return {
      resultCode: 1,
      resultMessage: 'OK',
      signUpToken: token,
      authenticationToken: genericKey,
      coreUserId: genericID,
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

export async function logIn (params) {
  const token = params[0]

  if (token === genericKey) {
    return {
      resultCode: 1,
      resultMessage: 'OK',
      sessionKey: genericKey,
      signInCount: 1
    }
  } else {
    return {
      resultCode: -1002,
      resultMessage: 'Invalid credentials'
    }
  }
}

export async function signUp (_params) {
  return {
    resultCode: 1,
    resultMessage: 'OK',
    signUpToken: genericKey,
    coreUserId: genericID
  }
}
