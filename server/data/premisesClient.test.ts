import nock from 'nock'

import premisesFactory from '../testutils/factories/premises'
import newPremisesFactory from '../testutils/factories/newPremises'
import updatePremisesFactory from '../testutils/factories/updatePremises'
import PremisesClient from './premisesClient'
import config from '../config'
import paths from '../paths/api'
import dateCapacityFactory from '../testutils/factories/dateCapacity'
import staffMemberFactory from '../testutils/factories/staffMember'

describe('PremisesClient', () => {
  let fakeApprovedPremisesApi: nock.Scope
  let premisesClient: PremisesClient

  const token = 'token-1'

  beforeEach(() => {
    config.apis.approvedPremises.url = 'http://localhost:8080'
    fakeApprovedPremisesApi = nock(config.apis.approvedPremises.url)
    premisesClient = new PremisesClient(token)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('all', () => {
    const premises = premisesFactory.buildList(5)

    it('should get all premises for the given service', async () => {
      fakeApprovedPremisesApi
        .get(paths.premises.index({}))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, premises)

      const output = await premisesClient.all()
      expect(output).toEqual(premises)
    })
  })

  describe('find', () => {
    const premises = premisesFactory.build()

    it('should get a single premises', async () => {
      fakeApprovedPremisesApi
        .get(paths.premises.show({ premisesId: premises.id }))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, premises)

      const output = await premisesClient.find(premises.id)
      expect(output).toEqual(premises)
    })
  })

  describe('capacity', () => {
    const premisesId = 'premisesId'
    const premisesCapacityItem = dateCapacityFactory.build()

    it('should get the capacity of a premises for a given date', async () => {
      fakeApprovedPremisesApi
        .get(paths.premises.capacity({ premisesId }))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, premisesCapacityItem)

      const output = await premisesClient.capacity(premisesId)
      expect(output).toEqual(premisesCapacityItem)
    })
  })

  describe('getStaffMembers', () => {
    const premises = premisesFactory.build()
    const staffMembers = staffMemberFactory.buildList(5)

    it('should return a list of staff members', async () => {
      fakeApprovedPremisesApi
        .get(paths.premises.staffMembers.index({ premisesId: premises.id }))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, staffMembers)

      const output = await premisesClient.getStaffMembers(premises.id)
      expect(output).toEqual(staffMembers)
    })
  })

  describe('create', () => {
    it('should return the premises that has been created', async () => {
      const premises = premisesFactory.build()
      const payload = newPremisesFactory.build({
        name: premises.name,
        postcode: premises.postcode,
      })

      fakeApprovedPremisesApi
        .post(paths.premises.create({}))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, premises)

      const output = await premisesClient.create(payload)
      expect(output).toEqual(premises)
    })
  })

  describe('update', () => {
    it('updates the given premises and returns the updated premises', async () => {
      const premises = premisesFactory.build()
      const payload = updatePremisesFactory.build({
        postcode: premises.postcode,
        notes: premises.notes,
      })

      fakeApprovedPremisesApi
        .put(paths.premises.update({ premisesId: premises.id }))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, premises)

      const output = await premisesClient.update(premises.id, payload)
      expect(output).toEqual(premises)
    })
  })
})
