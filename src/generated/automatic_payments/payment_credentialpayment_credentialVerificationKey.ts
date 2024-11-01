import { Data, mConStr } from "@meshsdk/core";

export interface payment_credentialpayment_credentialVerificationKey {
    /** primitive */
    VerificationKeyHash: string;
}

export function payment_credentialpayment_credentialVerificationKeyToData(data: payment_credentialpayment_credentialVerificationKey): Data {
    return {fields:[]} as Data;
}
