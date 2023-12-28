import catalog from '../static/catalog.js'

export async function getCatalog (_params, { sessionKey, settings }) {
  const result = {
    blueprints: [],
    placements: [],
    metadata: [],
    globalScript: '',
    sdkScript: '',
    serverVariables: sessionKey ? [] : undefined,
  }

  if (sessionKey === settings.guestKey) {
    function duplicate (content) {
      return JSON.parse(JSON.stringify(content))
    }

    result.blueprints = duplicate(catalog.blueprints)
    result.placements = duplicate(catalog.placements)

    if (settings.modifiers.productionTimeMultiplier !== 1) {
      for (const blueprint of result.blueprints) {
        for (const priceCandidate of blueprint.priceCandidates) {
          if (!Array.isArray(priceCandidate.price?.internalPrice)) continue
          for (const itemAndAmount of priceCandidate.price.internalPrice) {
            if (itemAndAmount.item.itemId !== 81032) continue
            itemAndAmount.amount *= settings.modifiers.productionTimeMultiplier
          }
        }
      }
    }
  } else {
    throw {
      code: 2,
      message: 'Authentication error'
    }
  }

  return result
}
