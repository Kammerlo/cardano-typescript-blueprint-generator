import {BlueprintSchema} from "./BlueprintSchema";

export type BlueprintDatum = {
    title?: string;
    description?: string;
    purpose?: string;
    schema : BlueprintSchema;
}