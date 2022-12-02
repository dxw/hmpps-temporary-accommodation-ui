import { SuperAgentRequest } from 'superagent'

import type { Arrival } from '@approved-premises/api'

import { stubFor, getMatchingRequests } from '../../wiremock'
import { errorStub } from '../../wiremock/utils'

export default {
  stubArrivalCreate: (args: { premisesId: string; bookingId: string; arrival: Arrival }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: `/premises/${args.premisesId}/bookings/${args.bookingId}/arrivals`,
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.arrival,
      },
    }),
  stubArrivalCreateErrors: (args: {
    premisesId: string
    bookingId: string
    params: Array<string>
  }): SuperAgentRequest =>
    stubFor(errorStub(args.params, `/premises/${args.premisesId}/bookings/${args.bookingId}/arrivals`, 'POST')),
  stubArrivalCreateConflictError: (args: { premisesId: string; bookingId: string }) =>
    stubFor({
      request: {
        method: 'POST',
        url: `/premises/${args.premisesId}/bookings/${args.bookingId}/arrivals`,
      },
      response: {
        status: 409,
        headers: {
          'Content-Type': 'application/problem+json;charset=UTF-8',
        },
        jsonBody: {
          title: 'Conflict',
          status: 409,
        },
      },
    }),
  verifyArrivalCreate: async (args: { premisesId: string; bookingId: string }) =>
    (
      await getMatchingRequests({
        method: 'POST',
        url: `/premises/${args.premisesId}/bookings/${args.bookingId}/arrivals`,
      })
    ).body.requests,
}
