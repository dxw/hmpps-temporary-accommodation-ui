import nock from 'nock'

import config from '../config'
import paths from '../paths/api'
import roomFactory from '../testutils/factories/room'
import newRoomFactory from '../testutils/factories/newRoom'
import RoomClient from './roomClient'

describe('Room Client', () => {
  let fakeApprovedPremisesApi: nock.Scope
  let roomClient: RoomClient

  const token = 'token-1'
  const premisesId = 'premisesId'

  beforeEach(() => {
    config.apis.approvedPremises.url = 'http://localhost:8080'
    fakeApprovedPremisesApi = nock(config.apis.approvedPremises.url)
    roomClient = new RoomClient(token)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('create', () => {
    it('should return the room that has been created', async () => {
      const room = roomFactory.build()

      const payload = newRoomFactory.build({
        name: room.name,
        notes: room.notes,
      })

      fakeApprovedPremisesApi
        .post(paths.premises.rooms.create({ premisesId }))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, room)

      const output = await roomClient.create(premisesId, payload)
      expect(output).toEqual(room)
    })
  })
})
