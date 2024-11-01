import { payment_credentialVerificationKey, payment_credentialVerificationKeyToData } from "./payment_credentialVerificationKey";
import { payment_credentialScript, payment_credentialScriptToData } from "./payment_credentialScript";
import { stake_credentialSome, stake_credentialSomeToData } from "./stake_credentialSome";
import { stake_credentialNone, stake_credentialNoneToData } from "./stake_credentialNone";
import { Data, mConStr } from "@meshsdk/core";

export interface ownerAddress {
    /** anyOf */
    /** constructor */
    /** 0 */
    payment_credentialVerificationKey: payment_credentialVerificationKey;
    /** anyOf */
    /** constructor */
    /** 1 */
    payment_credentialScript: payment_credentialScript;
    /** anyOf */
    /** constructor */
    /** 0 */
    stake_credentialSome: stake_credentialSome;
    /** anyOf */
    /** constructor */
    /** 1 */
    stake_credentialNone: stake_credentialNone;
}

export function ownerAddressToData(data: ownerAddress): Data {
    return {fields:[
    data.payment_credentialVerificationKey !== undefined ? mConStr(0, [payment_credentialVerificationKeyToData(data.payment_credentialVerificationKey)]) : 
    data.payment_credentialScript !== undefined ? mConStr(1, [payment_credentialScriptToData(data.payment_credentialScript)]) : 
    null,
    data.stake_credentialSome !== undefined ? mConStr(0, [stake_credentialSomeToData(data.stake_credentialSome)]) : 
    data.stake_credentialNone !== undefined ? mConStr(1, [stake_credentialNoneToData(data.stake_credentialNone)]) : 
    null,
    ]} as Data;
}
