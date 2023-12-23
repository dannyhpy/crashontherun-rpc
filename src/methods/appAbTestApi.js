import { genericKey } from '../constants.js'

const defaultAbCaseValues = {
  'milo_battle_run_speed_up': 0,
  'milo_collection_run_speed_up_2': 0,
  'milo_egp_ingredient_checkpoint_loss': 5,
  'milo_forage_run_goal': 1,
  'milo_instant_respawn': 1,
  'milo_low_60fps': 1,
  'milo_offers_rework': 0,
  'milo_revamp_phase_3': 1,
}

export async function getAppUserAbCases (params, { sessionKey }) {
  const userAbCases = params[0]
  if (!Array.isArray(userAbCases)) throw {
    code: -32602,
    message: 'Invalid params'
  }

  if (sessionKey === null) {
    throw {
      code: 3,
      message: 'No session key error'
    }
  } else if (sessionKey === genericKey) {
    const cases = []
    for (const userAbCase of userAbCases) {
      cases.push({
        version: 0,
        caseNum: defaultAbCaseValues[userAbCase] ?? 0
      })
    }
    return { cases }
  } else {
    throw {
      code: 2,
      message: 'Authentication error'
    }
  }
}
