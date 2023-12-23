import catalog from '../static/catalog.js'

export async function getCatalog (_params, { sessionKey }) {
  return {
    blueprints: catalog.blueprints,
    placements: catalog.placements,
    metadata: [],
    globalScript: 'console.log(window)',
    sdkScript: '',
    serverVariables: sessionKey ? [] : undefined
  }
}
