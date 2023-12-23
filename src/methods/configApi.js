import configEntries from '../static/configEntries.js'

export async function getConfigEntriesCached (params) {
  const gameVersion = params[0]
  const abGroupsHash = params[1]
  if (typeof gameVersion !== 'string') throw {
    code: -32602,
    message: 'Invalid params'
  }
  if (typeof abGroupsHash !== 'string') throw {
    code: -32602,
    message: 'Invalid params'
  }

  return {
    version: gameVersion,
    abGroupsHash: abGroupsHash,
    config: configEntries
  }
}
