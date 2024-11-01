import { Data, mConStr } from "@meshsdk/core";

export interface payment_credentialVerificationKey {
    /** primitive */
    VerificationKeyHash: string;
}

export function payment_credentialVerificationKeyToData(data: payment_credentialVerificationKey): Data {
    return {fields:[]} as Data;
}
