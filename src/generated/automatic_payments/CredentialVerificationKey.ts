import { Data, mConStr } from "@meshsdk/core";

export interface CredentialVerificationKey {
    /** primitive */
    VerificationKeyHash: string;
}

export function CredentialVerificationKeyToData(data: CredentialVerificationKey): Data {
    return {fields:[]} as Data;
}
