import type { Characteristic, Room, NewRoom } from '@approved-premises/api'
import { SummaryList } from '../@types/ui'
import { ReferenceDataClient, RestClientBuilder } from '../data'
import RoomClient from '../data/roomClient'
import { escape, formatLines } from '../utils/viewUtils'

export default class BedspaceService {
  constructor(
    private readonly roomClientFactory: RestClientBuilder<RoomClient>,
    private readonly referenceDataClientFactory: RestClientBuilder<ReferenceDataClient>,
  ) {}

  async getRoomDetails(token: string, premisesId: string): Promise<Array<{ room: Room; summaryList: SummaryList }>> {
    const roomClient = this.roomClientFactory(token)
    const rooms = await roomClient.all(premisesId)

    return rooms
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(room => ({
        room,
        summaryList: this.summaryListForRoom(room),
      }))
  }

  async createRoom(token: string, premisesId: string, newRoom: NewRoom): Promise<Room> {
    const roomClient = this.roomClientFactory(token)
    const room = await roomClient.create(premisesId, newRoom)

    return room
  }

  async getRoomCharacteristics(token: string): Promise<Array<Characteristic>> {
    const referenceDataClient = this.referenceDataClientFactory(token)
    return (await referenceDataClient.getReferenceData<Characteristic>('characteristics'))
      .filter(characteristic => characteristic.modelScope === 'room' || characteristic.modelScope === '*')
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  private summaryListForRoom(room: Room): SummaryList {
    const characteristics = room.characteristics
      .map(characteristic => characteristic.name)
      .sort((a, b) => a.localeCompare(b))
      .map(name => escape(name))

    return {
      rows: [
        {
          key: this.textValue('Attributes'),
          value:
            characteristics.length > 0
              ? this.htmlValue(`<ul><li>${characteristics.join('</li><li>')}</li></ul>`)
              : this.textValue(''),
        },
        {
          key: this.textValue('Notes'),
          value: this.htmlValue(formatLines(room.notes)),
        },
      ],
    }
  }

  private textValue(value: string) {
    return { text: value }
  }

  private htmlValue(value: string) {
    return { html: value }
  }
}
