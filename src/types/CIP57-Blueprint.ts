import {Validator} from "./Validator";

export type CIP57Blueprint = {
    preamble: {
        title: string;
        description?: string;
        version?: string;
        compiler?: {
            name: string;
            version: string;
        };
        plutusVersion?: string;
        license?: string;
    }
    validators: Validator[]
}