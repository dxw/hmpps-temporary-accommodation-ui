import premisesFactory from '../../server/testutils/factories/premises'
import bookingFactory from '../../server/testutils/factories/booking'
import BookingPage from '../pages/booking'
import Page from '../pages/page'
import PremisesPage from '../pages/premisesList'

context('Booking', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('should show booking form', () => {
    const booking = bookingFactory.build({
      CRN: '1bee477b-462f-47c1-8f71-7835a76a2c42',
      arrivalDate: new Date(Date.UTC(2022, 5, 1, 0, 0, 0)),
      expectedDepartureDate: new Date(Date.UTC(2022, 5, 3, 0, 0, 0)),
      keyWorker: 'Alex Evans',
    })

    const premises = premisesFactory.buildList(5)
    cy.task('stubBookingCreate', { premisesId: 'premisesId', booking })
    cy.task('stubPremises', premises)

    // Given I am signed in
    cy.signIn()

    // When I visit the booking page
    const page = BookingPage.visit()

    // And I fill in the booking form
    page.completeForm(booking)
    page.clickSubmit()

    // Then I should be redirected to the premises page
    Page.verifyOnPage(PremisesPage)
    PremisesPage.shouldShowFlashMessage()

    // And the booking should be created in the API
    cy.task('verifyBookingCreate', { premisesId: 'premisesId' }).then(requests => {
      expect(requests).to.have.length(1)
      const requestBody = JSON.parse(requests[0].body)

      expect(requestBody.CRN).equal('1bee477b-462f-47c1-8f71-7835a76a2c42')
      expect(requestBody.arrivalDate).equal((booking.arrivalDate as Date).toISOString())
      expect(requestBody.expectedDepartureDate).equal((booking.expectedDepartureDate as Date).toISOString())
      expect(requestBody.keyWorker).equal('55126a32-0d27-4044-bc4e-e21c01632e56')
    })
  })
})
