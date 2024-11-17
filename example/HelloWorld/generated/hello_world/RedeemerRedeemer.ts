import { Data, mConStr } from "@meshsdk/core";

export interface RedeemerRedeemer {
    /** primitive */
    msg: string;
}

export function RedeemerRedeemerToData(data: RedeemerRedeemer): Data {
    return data.msg
    ;
}
