import type { NewRoom } from '@approved-premises/api'
import Page from '../../page'
import paths from '../../../../server/paths/temporary-accommodation/manage'

export default class BedspaceNewPage extends Page {
  constructor() {
    super('Add a bedspace')
  }

  static visit(premisesId: string): BedspaceNewPage {
    cy.visit(paths.premises.bedspaces.new({ premisesId }))
    return new BedspaceNewPage()
  }

  completeForm(newRoom: NewRoom): void {
    this.getLabel('Enter a reference name')
    this.getTextInputByIdAndEnterDetails('name', newRoom.name)

    newRoom.characteristicIds.forEach(characteristicId => {
      this.checkCheckboxByNameAndValue('characteristicIds[]', characteristicId)
    })

    this.getLabel('Please provide any further bedspace details')
    this.getTextInputByIdAndEnterDetails('notes', newRoom.notes)

    this.clickSubmit()
  }
}
