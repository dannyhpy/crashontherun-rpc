import { createServer } from 'node:http'
import { createGzip } from 'node:zlib'

import worker from './worker.js'

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function requestListener (req, res) {
  const host = req.headers.host
  const url = `http://${host}${req.url}`

  /**
   * @param {string} name Header name
   * @returns {string | undefined}
   */
  function joinHeaderValues (name) {
    if (Array.isArray(req.headers[name])) {
      return req.headers[name].join(', ')
    }
    return req.headers[name]
  }

  const workerRequest = new Request(url, {
    method: req.method,
    headers: new Headers(req.headers),
    body: req,
    duplex: 'half'
  })

  const workerResponse = await worker.fetch(
    workerRequest,
    process.env
  ).catch((err) => console.error(err))
  if (!workerResponse) {
    res.writeHead(500).end()
    return
  }
  const resHeaders = {}
  workerResponse.headers.forEach(function (value, key) {
    const titleCaseKey = key
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    resHeaders[titleCaseKey.join('-')] = value
  })

  if (workerResponse.body === null) {
    res.writeHead(workerResponse.status, resHeaders).end()
    return
  }

  const acceptEncodings = (function () {
    if (!req.headers['accept-encoding']) return []
    return joinHeaderValues('accept-encoding')
      .split(';')[0] // Ignore quality weights in Accept-Encoding
      .split(',')
      .map(encoding => encoding.trim())
  })()

  if (acceptEncodings.includes('gzip')) {
    const gzip = createGzip()
    // TODO: Pipe `workerResponse.body` to `gzip`
    gzip.end(new Uint8Array(await workerResponse.arrayBuffer()))
    const chunks = []
    gzip.on('data', (chunk) => {
      chunks.push(chunk)
    })
    gzip.once('end', () => {
      const body = Buffer.concat(chunks)
      res.writeHead(workerResponse.status, {
        'Content-Encoding': 'gzip',
        'Content-Length': Buffer.byteLength(body),
        'Vary': 'Accept-Encoding',
        ...resHeaders
      })
      res.end(body)
    })
  } else {
    const body = new Uint8Array(await workerResponse.arrayBuffer())
    res.writeHead(workerResponse.status, {
      'Content-Length': Buffer.byteLength(body),
      ...resHeaders
    })
    res.end(body)
  }
}

const port = process.env.PORT
  ? +process.env.PORT
  : 8000
const server = createServer()
server.on('request', requestListener)
server.listen(port)
