import { temporaryAccommodationPath } from '../service'

const premisesPath = temporaryAccommodationPath.path('properties')
const singlePremisesPath = premisesPath.path(':premisesId')

const bedspacesPath = singlePremisesPath.path('bedspaces')
const singleBedspacePath = singlePremisesPath.path('bedspaces').path(':roomId')

const bookingsPath = singleBedspacePath.path('bookings')

const paths = {
  premises: {
    index: premisesPath,
    new: premisesPath.path('new'),
    create: premisesPath,
    edit: singlePremisesPath.path('edit'),
    update: singlePremisesPath,
    show: singlePremisesPath,
    bedspaces: {
      new: bedspacesPath.path('new'),
      create: bedspacesPath,
      edit: singleBedspacePath.path('edit'),
      update: singleBedspacePath,
      show: singleBedspacePath,
    },
  },
  bookings: {
    new: bookingsPath.path('new'),
    create: bookingsPath,
  },
}

export default paths
