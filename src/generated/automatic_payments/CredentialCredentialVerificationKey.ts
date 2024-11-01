import { Data, mConStr } from "@meshsdk/core";

export interface CredentialCredentialVerificationKey {
    /** primitive */
    VerificationKeyHash: string;
}

export function CredentialCredentialVerificationKeyToData(data: CredentialCredentialVerificationKey): Data {
    return {fields:[]} as Data;
}
