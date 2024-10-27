import {Data} from "@meshsdk/core";

export interface Student {
    id: number;
    name: string;
}

export function toData(student: Student): Data {
    return JSON.stringify(student);
}