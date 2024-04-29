export async function loadProducts (params, { sessionKey, settings }) {
  if (typeof params[0] !== 'object') throw {
    code: -32602,
    message: 'Invalid params'
  }
  if (!('placementIds' in params[0])) throw {
    code: -32602,
    message: 'Invalid params'
  }
  const requestedIDs = params[0]['placementIds']
  if (!Array.isArray(requestedIDs)) throw {
    code: -32602,
    message: 'Invalid params'
  }
  for (const it of requestedIDs) {
    if (typeof it !== 'string') throw {
      code: -32602,
      message: 'Invalid params'
    }
  }

  if (sessionKey === null) {
    throw {
      code: 3,
      message: 'No session key error'
    }
  } else if (sessionKey === settings.guestKey) {
    const placements = []

    for (const id of requestedIDs) {
      const placement = {
        placementId: id,
        metadata: [],
        products: []
      }
      placements.push(placement)

      switch (id) {
        case 'shop_section_teamRunTickets':
          placement.products.push({
            blueprintId: 'shop_teamRunTicket_1',
            placementId: id,
            version: '0',
            priceType: 'INTERNAL',
            internalPrices: [
              { itemTypeId: 81000, count: 10 }
            ],
            content: [
              {
                itemTypeId: 81381,
                count: 1,
                payload: ''
              }
            ],
            display: [
              {
                key: 'name',
                value: 'Shop.OfferName.TeamRunTicketsSmall'
              }
            ],
            metadata: []
          })

          placement.products.push({
            blueprintId: 'shop_teamRunTicket_2',
            placementId: id,
            version: '0',
            priceType: 'INTERNAL',
            internalPrices: [
              { itemTypeId: 81000, count: 25 }
            ],
            content: [
              {
                itemTypeId: 81381,
                count: 3,
                payload: ''
              }
            ],
            display: [
              {
                key: 'name',
                value: 'Shop.OfferName.TeamRunTicketsMedium'
              }
            ],
            metadata: []
          })

          placement.products.push({
            blueprintId: 'shop_teamRunTicket_3',
            placementId: id,
            version: '0',
            priceType: 'INTERNAL',
            internalPrices: [
              { itemTypeId: 81000, count: 40 }
            ],
            content: [
              {
                itemTypeId: 81381,
                count: 5,
                payload: ''
              }
            ],
            display: [
              {
                key: 'name',
                value: 'Shop.OfferName.TeamRunTicketsLarge'
              }
            ],
            metadata: []
          })

          break
      }
    }

    return { placements }
  } else {
    throw {
      code: 2,
      message: 'Authentication error'
    }
  }
}
