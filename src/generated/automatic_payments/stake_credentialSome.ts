import { StakeCredentialInline, StakeCredentialInlineToData } from "./StakeCredentialInline";
import { StakeCredentialPointer, StakeCredentialPointerToData } from "./StakeCredentialPointer";
import { Data, mConStr } from "@meshsdk/core";

export interface stake_credentialSome {
    /** anyOf */
    /** constructor */
    /** 0 */
    StakeCredentialInline: StakeCredentialInline;
    /** anyOf */
    /** constructor */
    /** 1 */
    StakeCredentialPointer: StakeCredentialPointer;
}

export function stake_credentialSomeToData(data: stake_credentialSome): Data {
    return {fields:[
    data.StakeCredentialInline !== undefined ? mConStr(0, [StakeCredentialInlineToData(data.StakeCredentialInline)]) : 
    data.StakeCredentialPointer !== undefined ? mConStr(1, [StakeCredentialPointerToData(data.StakeCredentialPointer)]) : 
    null,
    ]} as Data;
}
