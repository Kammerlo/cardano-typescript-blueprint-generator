import { ownerAddress, ownerAddressToData } from "./ownerAddress";
import { payeeownerAddress, payeeownerAddressToData } from "./payeeownerAddress";
import { end_timeSome, end_timeSomeToData } from "./end_timeSome";
import { end_timeNone, end_timeNoneToData } from "./end_timeNone";
import { payment_interval_hoursend_timeSome, payment_interval_hoursend_timeSomeToData } from "./payment_interval_hoursend_timeSome";
import { payment_interval_hoursend_timeNone, payment_interval_hoursend_timeNoneToData } from "./payment_interval_hoursend_timeNone";
import { max_payment_delay_hourspayment_interval_hoursend_timeSome, max_payment_delay_hourspayment_interval_hoursend_timeSomeToData } from "./max_payment_delay_hourspayment_interval_hoursend_timeSome";
import { max_payment_delay_hourspayment_interval_hoursend_timeNone, max_payment_delay_hourspayment_interval_hoursend_timeNoneToData } from "./max_payment_delay_hourspayment_interval_hoursend_timeNone";
import { Data, mConStr } from "@meshsdk/core";

export interface AutomatedPaymentAutomatedPayment {
    /** constructor */
    /** 0 */
    ownerAddress: ownerAddress;
    /** constructor */
    /** 0 */
    payeeownerAddress: payeeownerAddress;
    /** primitive */
    start_time: number;
    /** anyOf */
    /** constructor */
    /** 0 */
    end_timeSome: end_timeSome;
    /** anyOf */
    /** constructor */
    /** 1 */
    end_timeNone: end_timeNone;
    /** anyOf */
    /** constructor */
    /** 0 */
    payment_interval_hoursend_timeSome: payment_interval_hoursend_timeSome;
    /** anyOf */
    /** constructor */
    /** 1 */
    payment_interval_hoursend_timeNone: payment_interval_hoursend_timeNone;
    /** anyOf */
    /** constructor */
    /** 0 */
    max_payment_delay_hourspayment_interval_hoursend_timeSome: max_payment_delay_hourspayment_interval_hoursend_timeSome;
    /** anyOf */
    /** constructor */
    /** 1 */
    max_payment_delay_hourspayment_interval_hoursend_timeNone: max_payment_delay_hourspayment_interval_hoursend_timeNone;
    /** primitive */
    max_fees_lovelace: number;
}

export function AutomatedPaymentAutomatedPaymentToData(data: AutomatedPaymentAutomatedPayment): Data {
    return {fields:[
    mConStr(0, [ownerAddressToData(data.ownerAddress)]),
    mConStr(0, [payeeownerAddressToData(data.payeeownerAddress)]),
    data.start_time,
    data.end_timeSome !== undefined ? mConStr(0, [end_timeSomeToData(data.end_timeSome)]) : 
    data.end_timeNone !== undefined ? mConStr(1, [end_timeNoneToData(data.end_timeNone)]) : 
    null,
    data.payment_interval_hoursend_timeSome !== undefined ? mConStr(0, [payment_interval_hoursend_timeSomeToData(data.payment_interval_hoursend_timeSome)]) : 
    data.payment_interval_hoursend_timeNone !== undefined ? mConStr(1, [payment_interval_hoursend_timeNoneToData(data.payment_interval_hoursend_timeNone)]) : 
    null,
    data.max_payment_delay_hourspayment_interval_hoursend_timeSome !== undefined ? mConStr(0, [max_payment_delay_hourspayment_interval_hoursend_timeSomeToData(data.max_payment_delay_hourspayment_interval_hoursend_timeSome)]) : 
    data.max_payment_delay_hourspayment_interval_hoursend_timeNone !== undefined ? mConStr(1, [max_payment_delay_hourspayment_interval_hoursend_timeNoneToData(data.max_payment_delay_hourspayment_interval_hoursend_timeNone)]) : 
    null,
    ]} as Data;
}
