import { Data, mConStr } from "@meshsdk/core";

export interface DatumDatum {
    /** primitive */
    owner: string;
}

export function DatumDatumToData(data: DatumDatum): Data {
    return data.owner
    ;
}
