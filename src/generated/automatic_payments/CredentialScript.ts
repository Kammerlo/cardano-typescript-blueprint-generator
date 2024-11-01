import { Data, mConStr } from "@meshsdk/core";

export interface CredentialScript {
    /** primitive */
    ScriptHash: string;
}

export function CredentialScriptToData(data: CredentialScript): Data {
    return {fields:[]} as Data;
}
