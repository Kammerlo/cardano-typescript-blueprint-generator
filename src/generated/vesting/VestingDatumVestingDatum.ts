import { Data, mConStr } from "@meshsdk/core";

export interface VestingDatumVestingDatum {
    /** primitive */
    lock_until: number;
    /** primitive */
    owner: string;
    /** primitive */
    beneficiary: string;
}

export function VestingDatumVestingDatumToData(data: VestingDatumVestingDatum): Data {
    return [data.lock_until,data.owner,data.beneficiary,];
}
