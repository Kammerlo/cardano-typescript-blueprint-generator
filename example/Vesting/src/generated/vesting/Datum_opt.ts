import { VestingDatumVestingDatum, VestingDatumVestingDatumToData } from "./VestingDatumVestingDatum";
import { Data, mConStr } from "@meshsdk/core";

/** Autogenerated file, do not modify **/
export interface Datum_opt {
    /** constructor */
    /** 0 */
    VestingDatumVestingDatum: VestingDatumVestingDatum;
}

export function toMeshJSData(data: Datum_opt): Data {
    return mConStr(0, [VestingDatumVestingDatumToData(data.VestingDatumVestingDatum)])
    ;
}