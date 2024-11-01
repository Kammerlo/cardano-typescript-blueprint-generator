import { StakeCredentialStakeCredentialInline, StakeCredentialStakeCredentialInlineToData } from "./StakeCredentialStakeCredentialInline";
import { StakeCredentialStakeCredentialPointer, StakeCredentialStakeCredentialPointerToData } from "./StakeCredentialStakeCredentialPointer";
import { Data, mConStr } from "@meshsdk/core";

export interface stake_credentialstake_credentialSome {
    /** anyOf */
    /** constructor */
    /** 0 */
    StakeCredentialStakeCredentialInline: StakeCredentialStakeCredentialInline;
    /** anyOf */
    /** constructor */
    /** 1 */
    StakeCredentialStakeCredentialPointer: StakeCredentialStakeCredentialPointer;
}

export function stake_credentialstake_credentialSomeToData(data: stake_credentialstake_credentialSome): Data {
    return {fields:[
    data.StakeCredentialStakeCredentialInline !== undefined ? mConStr(0, [StakeCredentialStakeCredentialInlineToData(data.StakeCredentialStakeCredentialInline)]) : 
    data.StakeCredentialStakeCredentialPointer !== undefined ? mConStr(1, [StakeCredentialStakeCredentialPointerToData(data.StakeCredentialStakeCredentialPointer)]) : 
    null,
    ]} as Data;
}
