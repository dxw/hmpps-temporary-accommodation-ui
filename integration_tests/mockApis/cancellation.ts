import type { SuperAgentRequest } from 'superagent'
import type { Cancellation } from '@approved-premises/api'

import { stubFor, getMatchingRequests } from '../../wiremock'
import { errorStub } from '../../wiremock/utils'

export default {
  stubCancellationCreate: (args: {
    premisesId: string
    bookingId: string
    cancellation: Cancellation
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        url: `/premises/${args.premisesId}/bookings/${args.bookingId}/cancellations`,
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.cancellation,
      },
    }),
  stubCancellationGet: (args: { premisesId: string; bookingId: string; cancellation: Cancellation }) =>
    stubFor({
      request: {
        method: 'GET',
        url: `/premises/${args.premisesId}/bookings/${args.bookingId}/cancellations/${args.cancellation.id}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: args.cancellation,
      },
    }),
  stubCancellationErrors: (args: { premisesId: string; bookingId: string; params: Array<string> }) =>
    stubFor(errorStub(args.params, `/premises/${args.premisesId}/bookings/${args.bookingId}/cancellations`, 'POST')),
  verifyCancellationCreate: async (args: { premisesId: string; bookingId: string; cancellation: Cancellation }) =>
    (
      await getMatchingRequests({
        method: 'POST',
        url: `/premises/${args.premisesId}/bookings/${args.bookingId}/cancellations`,
      })
    ).body.requests,
}
