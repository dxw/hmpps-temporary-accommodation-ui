import BookingService from './bookingService'
import BookingClient from '../data/bookingClient'

import newBookingFactory from '../testutils/factories/newBooking'
import bookingExtensionFactory from '../testutils/factories/bookingExtension'
import bookingFactory from '../testutils/factories/booking'

import paths from '../paths/manage'
import { DateFormats } from '../utils/dateUtils'

jest.mock('../data/bookingClient.ts')
jest.mock('../data/referenceDataClient.ts')

describe('BookingService', () => {
  const bookingClient = new BookingClient(null) as jest.Mocked<BookingClient>

  const bookingClientFactory = jest.fn()

  const service = new BookingService(bookingClientFactory)
  const token = 'SOME_TOKEN'

  const premisesId = 'premiseId'

  beforeEach(() => {
    jest.resetAllMocks()
    bookingClientFactory.mockReturnValue(bookingClient)
  })

  describe('create', () => {
    it('on success returns the booking that has been posted', async () => {
      const booking = bookingFactory.build()
      const newBooking = newBookingFactory.build()
      bookingClient.create.mockResolvedValue(booking)

      const postedBooking = await service.create(token, premisesId, newBooking)
      expect(postedBooking).toEqual(booking)

      expect(bookingClientFactory).toHaveBeenCalledWith(token)
      expect(bookingClient.create).toHaveBeenCalledWith('premisesId', newBooking)
    })
  })

  describe('find', () => {
    it('on success returns the booking that has been requested', async () => {
      const arrivalDate = new Date(2022, 2, 11)
      const departureDate = new Date(2022, 2, 12)

      const booking = bookingFactory.build({
        arrivalDate: arrivalDate.toISOString(),
        departureDate: departureDate.toISOString(),
      })

      bookingClient.find.mockResolvedValue(booking)

      const retrievedBooking = await service.find(token, premisesId, booking.id)
      expect(retrievedBooking).toEqual(booking)

      expect(bookingClientFactory).toHaveBeenCalledWith(token)
      expect(bookingClient.find).toHaveBeenCalledWith(premisesId, booking.id)
    })
  })

  describe('listOfBookingsForPremisesId', () => {
    it('should return table rows of bookings', async () => {
      const bookings = bookingFactory.buildList(3)

      bookingClient.allBookingsForPremisesId.mockResolvedValue(bookings)

      const results = await service.listOfBookingsForPremisesId(token, premisesId)

      expect(results).toEqual(service.bookingsToTableRows(bookings, premisesId, 'arrival'))

      expect(bookingClient.allBookingsForPremisesId).toHaveBeenCalledWith(premisesId)

      expect(bookingClientFactory).toHaveBeenCalledWith(token)
      expect(bookingClient.allBookingsForPremisesId).toHaveBeenCalledWith(premisesId)
    })
  })

  describe('groupedListOfBookingsForPremisesId', () => {
    it('should return table rows of bookings', async () => {
      const bookingsArrivingToday = bookingFactory.arrivingToday().buildList(2)
      const arrivedBookings = bookingFactory.arrivedToday().buildList(2)

      const bookingsDepartingToday = bookingFactory.departingToday().buildList(3)
      const departedBookings = bookingFactory.departedToday().buildList(5)

      const bookingsArrivingSoon = bookingFactory.arrivingSoon().buildList(2)

      const cancelledBookingsWithFutureArrivalDate = bookingFactory.cancelledWithFutureArrivalDate().buildList(2)

      const bookingsDepartingSoon = bookingFactory.departingSoon().buildList(3)

      const bookings = [
        ...bookingsArrivingToday,
        ...arrivedBookings,
        ...bookingsDepartingToday,
        ...departedBookings,
        ...bookingsArrivingSoon,
        ...cancelledBookingsWithFutureArrivalDate,
        ...bookingsDepartingSoon,
      ]
      bookingClient.allBookingsForPremisesId.mockResolvedValue(bookings)

      const results = await service.groupedListOfBookingsForPremisesId(token, premisesId)

      expect(results.arrivingToday).toEqual(service.bookingsToTableRows(bookingsArrivingToday, premisesId, 'arrival'))
      expect(results.departingToday).toEqual(
        service.bookingsToTableRows(bookingsDepartingToday, premisesId, 'departure'),
      )
      expect(results.upcomingArrivals).toEqual(service.bookingsToTableRows(bookingsArrivingSoon, premisesId, 'arrival'))
      expect(results.upcomingDepartures).toEqual(
        service.bookingsToTableRows(bookingsDepartingSoon, premisesId, 'departure'),
      )

      expect(bookingClient.allBookingsForPremisesId).toHaveBeenCalledWith(premisesId)

      expect(bookingClientFactory).toHaveBeenCalledWith(token)
      expect(bookingClient.allBookingsForPremisesId).toHaveBeenCalledWith(premisesId)
    })
  })

  describe('extendBooking', () => {
    it('on success returns the booking that has been extended', async () => {
      const booking = bookingExtensionFactory.build()
      bookingClient.extendBooking.mockResolvedValue(booking)
      const newDepartureDateObj = {
        newDepartureDate: new Date(2042, 13, 11).toISOString(),
        'newDepartureDate-year': '2042',
        'newDepartureDate-month': '12',
        'newDepartureDate-day': '11',
        notes: 'Some notes',
      }

      const extendedBooking = await service.extendBooking(token, premisesId, booking.id, newDepartureDateObj)

      expect(extendedBooking).toEqual(booking)
      expect(bookingClientFactory).toHaveBeenCalledWith(token)
      expect(bookingClient.extendBooking).toHaveBeenCalledWith(premisesId, booking.id, newDepartureDateObj)
    })
  })

  describe('bookingsToTableRows', () => {
    it('should convert bookings to table rows with an arrival date', () => {
      const booking1Date = new Date(2022, 10, 22)
      const booking2Date = new Date(2022, 2, 11)

      const bookings = [
        bookingFactory.build({ arrivalDate: booking1Date.toISOString() }),
        bookingFactory.build({ arrivalDate: booking2Date.toISOString() }),
      ]

      const results = service.bookingsToTableRows(bookings, premisesId, 'arrival')

      expect(results[0][0]).toEqual({ text: bookings[0].person.crn })
      expect(results[0][1]).toEqual({ text: DateFormats.dateObjtoUIDate(booking1Date) })
      expect(results[0][2]).toEqual({
        html: expect.stringMatching(paths.bookings.show({ premisesId, bookingId: bookings[0].id })),
      })

      expect(results[1][0]).toEqual({ text: bookings[1].person.crn })
      expect(results[1][1]).toEqual({ text: DateFormats.dateObjtoUIDate(booking2Date) })
      expect(results[1][2]).toEqual({
        html: expect.stringMatching(paths.bookings.show({ premisesId, bookingId: bookings[1].id })),
      })
    })

    it('should convert bookings to table rows with a departure date', () => {
      const booking1Date = new Date(2022, 10, 22)
      const booking2Date = new Date(2022, 2, 11)

      const bookings = [
        bookingFactory.build({ departureDate: booking1Date.toISOString() }),
        bookingFactory.build({ departureDate: booking2Date.toISOString() }),
      ]

      const results = service.bookingsToTableRows(bookings, premisesId, 'departure')

      expect(results[0][0]).toEqual({ text: bookings[0].person.crn })
      expect(results[0][1]).toEqual({ text: DateFormats.dateObjtoUIDate(booking1Date) })
      expect(results[0][2]).toEqual({
        html: expect.stringMatching(paths.bookings.show({ premisesId, bookingId: bookings[0].id })),
      })

      expect(results[1][0]).toEqual({ text: bookings[1].person.crn })
      expect(results[1][1]).toEqual({ text: DateFormats.dateObjtoUIDate(booking2Date) })
      expect(results[1][2]).toEqual({
        html: expect.stringMatching(paths.bookings.show({ premisesId, bookingId: bookings[1].id })),
      })
    })
  })

  describe('currentResidents', () => {
    it('should return table rows of the current residents', async () => {
      const bookingsArrivingToday = bookingFactory.arrivingToday().buildList(2)
      const currentResidents = bookingFactory.arrived().buildList(2)

      bookingClient.allBookingsForPremisesId.mockResolvedValue([...currentResidents, ...bookingsArrivingToday])

      const results = await service.currentResidents(token, premisesId)

      expect(results).toEqual(service.currentResidentsToTableRows(currentResidents, premisesId))

      expect(bookingClient.allBookingsForPremisesId).toHaveBeenCalledWith(premisesId)

      expect(bookingClientFactory).toHaveBeenCalledWith(token)
      expect(bookingClient.allBookingsForPremisesId).toHaveBeenCalledWith(premisesId)
    })
  })
})
