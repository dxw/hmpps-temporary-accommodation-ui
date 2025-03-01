/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApArea } from './ApArea';
import type { Characteristic } from './Characteristic';
import type { LocalAuthorityArea } from './LocalAuthorityArea';
import type { ProbationRegion } from './ProbationRegion';

export type Premises = {
    id: string;
    name: string;
    addressLine1: string;
    postcode: string;
    bedCount: number;
    availableBedsForToday: number;
    service?: string;
    notes?: string;
    probationRegion: ProbationRegion;
    apArea: ApArea;
    localAuthorityArea: LocalAuthorityArea;
    characteristics?: Array<Characteristic>;
};

