import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

import throwMissingCypressEnvError from './utils'

import {
  BookingNewPage,
  BookingConfirmationPage,
  BookingFindPage,
  PremisesShowPage,
} from '../../../cypress_shared/pages/manage'

import bookingFactory from '../../../server/testutils/factories/booking'
import personFactory from '../../../server/testutils/factories/person'

const offenderName = Cypress.env('offender_name') || throwMissingCypressEnvError('offender_name')
const offenderCrn = Cypress.env('offender_crn') || throwMissingCypressEnvError('offender_crn')

const person = personFactory.build({ name: offenderName, crn: offenderCrn })
const booking = bookingFactory.build({ person })

Given('I create a booking', () => {
  cy.get('@premisesShowPage').then((premisesShowPage: PremisesShowPage) => {
    premisesShowPage.clickCreateBookingOption()
  })

  const bookingNewPage = new BookingFindPage()
  bookingNewPage.enterCrn(person.crn)
  bookingNewPage.clickSubmit()

  const form = new BookingNewPage()

  form.verifyPersonIsVisible(person)
  form.completeForm(booking)
  form.clickSubmit()
})

Then('I should see a confirmation screen for my booking', () => {
  const page = new BookingConfirmationPage()

  page.verifyBookingIsVisible(booking)
})
