import Pako from 'pako'

import rpcMethods from './methods/index.js'

function isRpcRequestValid (rpcRequest) {
  if (typeof rpcRequest !== 'object') return false
  if (rpcRequest === null) return false
  if (rpcRequest.jsonrpc !== '2.0') return false
  if (typeof rpcRequest.method !== 'string') return false

  if (rpcRequest.id !== undefined) {
    if (
      typeof rpcRequest.id !== 'string' &&
      typeof rpcRequest.id !== 'number' &&
      rpcRequest.id !== null
    ) return false
  }

  if (rpcRequest.params !== undefined) {
    if (typeof rpcRequest.params !== 'object') return false
    if (rpcRequest.params === null) return false
  }

  return true
}

export default {
  /**
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async fetch (request) {
    if (request.method === 'GET') return new Response(null, { status: 404 })
    if (request.method !== 'POST') return new Response(null, { status: 405 })

    const url = new URL(request.url)
    const sessionKey = url.searchParams.get('_session')

    const contentEncoding = request.headers.get('Content-Encoding')
    if (!['gzip', null].includes(contentEncoding)) return new Response(null, { status: 415 })
    const contentLength = request.headers.get('Content-Length')
    if (+contentLength === 0) return new Response(null, { status: 400 })

    const body = await (async function () {
      switch (contentEncoding) {
        case 'gzip':
          try {
            const compressed = new Uint8Array(await request.arrayBuffer())
            const plaintext = Pako.ungzip(compressed, { to: 'string' })
            return JSON.parse(plaintext)
          } catch (_err) {
            return null
          }
        default:
          return request.json()
            .catch(() => null)
      }
    })()
    if (!body) return new Response(null, { status: 400 })
    if (!(typeof body === 'object')) return new Response(null, { status: 400 })

    // https://www.jsonrpc.org/specification

    const isBodyAnArray = Array.isArray(body)
    if (isBodyAnArray && body.length === 0) {
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request'
        },
        id: null
      })) 
    }
    const rpcRequests = (function () {
      if (!isBodyAnArray) return [body]
      return body
    })()
    const rpcResponses = []

    // DEBUG:
    //console.log('>', JSON.stringify(rpcRequests))

    for (const rpcRequest of rpcRequests) {
      if (!isRpcRequestValid(rpcRequest)) {
        rpcResponses.push({
          jsonrpc: '2.0',
          error: {
            code: -32600,
            message: 'Invalid Request'
          },
          id: null
        })
        continue
      }

      if (!Object.keys(rpcMethods).includes(rpcRequest.method)) {
        if (rpcRequest.id !== undefined) {
          rpcResponses.push({
            jsonrpc: '2.0',
            error: {
              code: -32601,
              message: 'Method not found'
            },
            id: rpcRequest.id
          })
        }
        continue
      }

      const rpcResp = { jsonrpc: '2.0' }
      try {
        const fnRes = await rpcMethods[rpcRequest.method](
          rpcRequest.params,
          {
            httpRequest: request,
            rpcRequest,
            sessionKey
          }
        )
        rpcResp.result = fnRes ?? null
      } catch (err) {
        delete rpcResp.result
        if (err instanceof Error) {
          console.error(`"${rpcRequest.method}":`)
          console.error(err)
          rpcResp.error = {
            code: 0,
            message: 'Server error'
          }
        } else {
          rpcResp.error = {
            code: err.code,
            message: err.message
          }
        }
      } finally {
        if (rpcRequest.id !== undefined) {
          rpcResp.id = rpcRequest.id
          rpcResponses.push(rpcResp)
        }
      }
    }

    // DEBUG:
    //console.log('<', JSON.stringify(rpcResponses))

    if (rpcResponses.length === 0) {
      return new Response(null, { status: 204 })
    }

    return new Response(
      JSON.stringify((function () {
        if (!isBodyAnArray) return rpcResponses[0]
        return rpcResponses
      })()),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
