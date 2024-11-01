import { Data, mConStr } from "@meshsdk/core";

export interface end_timeSome {
    /** primitive */
    end_timeSomeInt: number;
}

export function end_timeSomeToData(data: end_timeSome): Data {
    return {fields:[]} as Data;
}
