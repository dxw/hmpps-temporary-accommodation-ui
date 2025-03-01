/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnyValue } from './AnyValue';

export type UpdateApplication = {
    data: Record<string, AnyValue>;
    document?: Record<string, AnyValue>;
    isWomensApplication?: boolean;
    isPipeApplication?: boolean;
    submittedAt?: string;
};

