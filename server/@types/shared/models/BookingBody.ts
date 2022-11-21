/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Bed } from './Bed';
import type { Person } from './Person';
import type { ServiceName } from './ServiceName';
import type { StaffMember } from './StaffMember';

export type BookingBody = {
    id: string;
    person: Person;
    arrivalDate: string;
    departureDate: string;
    keyWorker?: StaffMember;
    serviceName: ServiceName;
    bed?: Bed;
};

