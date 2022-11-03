import type { Premises, Room } from '@approved-premises/api'

import Page from '../../page'
import paths from '../../../../server/paths/temporary-accommodation/manage'

export default class PremisesShowPage extends Page {
  constructor(private readonly premises: Premises) {
    super('Manage a property')
  }

  static visit(premises: Premises): PremisesShowPage {
    cy.visit(paths.premises.show({ premisesId: premises.id }))
    return new PremisesShowPage(premises)
  }

  shouldShowPremisesDetails(): void {
    cy.get('h2').should('contain', `${this.premises.addressLine1}, ${this.premises.postcode}`)

    cy.get(`[data-cy-premises]`).within(() => {
      cy.get('h3').should('contain', this.premises.name)

      cy.get('.govuk-summary-list__key')
        .contains('Address')
        .siblings('.govuk-summary-list__value')
        .should('contain', this.premises.addressLine1)
        .should('contain', this.premises.postcode)

      cy.get('.govuk-summary-list__key')
        .contains('Local authority')
        .siblings('.govuk-summary-list__value')
        .should('contain', this.premises.localAuthorityArea.name)

      this.premises.characteristics.forEach(characteristic => {
        cy.get('.govuk-summary-list__key')
          .contains('Attributes')
          .siblings('.govuk-summary-list__value')
          .should('contain', characteristic.name)
      })

      this.premises.notes.split('\n').forEach(noteLine => {
        cy.get('.govuk-summary-list__key')
          .contains('Notes')
          .siblings('.govuk-summary-list__value')
          .should('contain', noteLine)
      })
    })
  }

  shouldShowRoomDetails(room: Room): void {
    cy.get(`[data-cy-room="${room.id}"]`).within(() => {
      cy.get('h4').should('contain', room.name)

      room.characteristics.forEach(characteristic => {
        cy.get('.govuk-summary-list__key')
          .contains('Attributes')
          .siblings('.govuk-summary-list__value')
          .should('contain', characteristic.name)
      })

      room.notes.split('\n').forEach(noteLine => {
        cy.get('.govuk-summary-list__key')
          .contains('Notes')
          .siblings('.govuk-summary-list__value')
          .should('contain', noteLine)
      })
    })
  }
}
