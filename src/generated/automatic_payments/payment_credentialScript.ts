import { Data, mConStr } from "@meshsdk/core";

export interface payment_credentialScript {
    /** primitive */
    ScriptHash: string;
}

export function payment_credentialScriptToData(data: payment_credentialScript): Data {
    return {fields:[]} as Data;
}
