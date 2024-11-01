import { payment_credentialpayment_credentialVerificationKey, payment_credentialpayment_credentialVerificationKeyToData } from "./payment_credentialpayment_credentialVerificationKey";
import { payment_credentialpayment_credentialScript, payment_credentialpayment_credentialScriptToData } from "./payment_credentialpayment_credentialScript";
import { stake_credentialstake_credentialSome, stake_credentialstake_credentialSomeToData } from "./stake_credentialstake_credentialSome";
import { stake_credentialstake_credentialNone, stake_credentialstake_credentialNoneToData } from "./stake_credentialstake_credentialNone";
import { Data, mConStr } from "@meshsdk/core";

export interface payeeownerAddress {
    /** anyOf */
    /** constructor */
    /** 0 */
    payment_credentialpayment_credentialVerificationKey: payment_credentialpayment_credentialVerificationKey;
    /** anyOf */
    /** constructor */
    /** 1 */
    payment_credentialpayment_credentialScript: payment_credentialpayment_credentialScript;
    /** anyOf */
    /** constructor */
    /** 0 */
    stake_credentialstake_credentialSome: stake_credentialstake_credentialSome;
    /** anyOf */
    /** constructor */
    /** 1 */
    stake_credentialstake_credentialNone: stake_credentialstake_credentialNone;
}

export function payeeownerAddressToData(data: payeeownerAddress): Data {
    return {fields:[
    data.payment_credentialpayment_credentialVerificationKey !== undefined ? mConStr(0, [payment_credentialpayment_credentialVerificationKeyToData(data.payment_credentialpayment_credentialVerificationKey)]) : 
    data.payment_credentialpayment_credentialScript !== undefined ? mConStr(1, [payment_credentialpayment_credentialScriptToData(data.payment_credentialpayment_credentialScript)]) : 
    null,
    data.stake_credentialstake_credentialSome !== undefined ? mConStr(0, [stake_credentialstake_credentialSomeToData(data.stake_credentialstake_credentialSome)]) : 
    data.stake_credentialstake_credentialNone !== undefined ? mConStr(1, [stake_credentialstake_credentialNoneToData(data.stake_credentialstake_credentialNone)]) : 
    null,
    ]} as Data;
}
