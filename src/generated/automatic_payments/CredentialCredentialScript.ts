import { Data, mConStr } from "@meshsdk/core";

export interface CredentialCredentialScript {
    /** primitive */
    ScriptHash: string;
}

export function CredentialCredentialScriptToData(data: CredentialCredentialScript): Data {
    return {fields:[]} as Data;
}
